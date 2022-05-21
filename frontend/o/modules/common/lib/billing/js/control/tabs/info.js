/**
 * @class O.lib.billing.tab.Info
 */
C.utils.inherit('O.lib.billing.tab.Info', {
/**
	* Loads account data
	*/
	loadInfo: function(record) {
		C.get('x_tariff'); // try to load x_tariff entities
		record.set('billing_disabled', this.billingDisabled);
		this.down('#fieldDisable').suspendEvents();
		this.loadRecord(record);
		this.down('#fieldDisable').resumeEvents();
		var new_tariff = record.get('new_tariff');
		if (new_tariff && new_tariff.tariff_sdt) {
			var field = this.down('#fieldTariff');
			field.setValue(field.getValue() +
				this.formatNewTariff(new_tariff));
		}
		if (this.issueInvoiceValue) {
			this.issueInvoice(this.issueInvoiceValue);
		}
	},

/**
	* Создает окно для пополнения счета, если сумма и метод не пусты
	*/
	createRefillWindow: function(button) {
		var data = {};
		button.ownerCt.items.each(function(field) {
			if (typeof field.getValue == "function") {
				var fieldName = field.getName() == 'paymentType' ?
					'id_payment_type' : field.getName();
				data[fieldName] = field.getValue();
			}
		}, this);

		var account = this.selected;
		data.id_account = account.get('id');

		if (this.firmid) {
			data.id_firm = this.firmid;
		}

		this.setLoading(true);
		this.clearData();

		Ext.Ajax.request({
			url: '/billing_invoice/',
			method: 'post',
			params: data,
			scope: this,
			success: function(response) {

				var response = Ext.decode(response.responseText),
					data = response.data;

				var date = new Date(data.sdt);
				date = date.pg_utc(C.getSetting('p.utc_value'));
				data.sdt = date;

				var store = C.getStore('billing_payment_type');
				var payment_type = store.getAt(
					store.find('id', data.id_payment_type));

				if (payment_type.get('param') == 'print') {
					this.fireEvent('invoice_created', data.id);
				} else {
					Ext.create('O.window.PendingPayment', {data: data});
				}

				this.setLoading(false);
			}
		});
	},

/**
	* Очищает введенные данные
	*/
	clearData: function() {
		this.down('[name=amount]').setValue('');
	},

/**
	 * Создает окно для изменения лимита аккаунта
	 */
	editLimitValue: function(button) {
		var record = this.selected;
		var data = {
			currentValue: record.get('limitvalue'),
			accountId: record.get('id')
		};
		var window = Ext.create('O.window.EditAccountLimit', {data: data});
		window.on({
			limit_changed: this.onLimitEdit,
			scope: this
		});
	},

/**
	 * Принимает сигнал об успешном изменении лимита аккаунта
	 */
	onLimitEdit: function(data) {
		this.fireEvent('limit_changed');
		this.fireEvent('account_changed', {
			'limitvalue_edt': data.edt,
			'limitvalue': data.value,
			'limitvalue_fmt': data.value
		});
	},

/**
	* Создает окно для изменения тарифа аккаунта
	*/
	editLimitTariff: function(button) {
		var record = this.selected;
		var tariffId = record.get('new_tariff') ?
			record.get('new_tariff').id_tariff : record.get('id_tariff');
		var data = {
			accountId: record.get('id'),
			tariffId: tariffId
		};
		var window = Ext.create('O.window.EditAccountTariff', {data: data});
		window.on({
			tariff_changed: this.onTariffEdit,
			scope: this
		});
	},

/**
	* Принимает сигнал об успешном изменении тарифа аккаунта
	*/
	onTariffEdit: function(data) {
		this.fireEvent('account_changed', {
			'id_tariff': data.value,
			'tariff': data.name,
			'tariff_sdt': data.sdt
		});
	},

/**
	* Создает окно для изменения тарифа аккаунта
	*/
	editLimitBalance: function(button) {
		var record = this.selected;
		var data = {
			accountId: record.get('id'),
			balance: record.get('balance')
		};
		var window = Ext.create('O.window.EditAccountBalance', {data: data});
		window.on({
			balance_changed: this.onBalanceEdit,
			scope: this
		});
	},

/**
	* Принимает сигнал об успешном изменении баланса аккаунта
	*/
	onBalanceEdit: function(data) {
		this.fireEvent('account_changed', {
			'balance': data.balance,
			'balance_fmt': data.balance
		});
		this.fireEvent('history_changed');
	},

/**
	 * Включает/отключает кнопку пополнения баланса
	 */
	onInputChange: function() {
		if (this.fieldAmount.getValue() > 0 && this.fieldType.getValue()) {
			this.fieldCreateRefill.enable();
		} else {
			this.fieldCreateRefill.disable();
		}
	},

/**
	 * Отключает списание средств
	 */
	billingDisable: function(checkbox, value) {
		var data = {
			id: this.selected.get('id_firm'),
			value: value
		}
		// Set billing disabled value to firm record
		if (this.firmRecord) {
			this.firmRecord.set('billing_disabled', value + 0);
			this.firmRecord.commit();
		}

		this.setLoading(true);

		Ext.Ajax.request({
			url: '/billing_account/disable',
			method: 'post',
			params: data,
			scope: this,
			success: function(response) {
				this.setLoading(false);
			}
		});
	},

/**
	* Tries to issue an invoice
	* @param {Number} value Invoice sum
	*/
	issueInvoice: function(value) {
		if (!(value > 0)) { return; }
		this.issueInvoiceValue = value;
		if (this.selected) {
			this.fieldAmount.setValue(this.issueInvoiceValue);
			var store = this.fieldType.getStore();
			if (store) {
				if (store.getCount() == 1) {
					// issue an invoice
					this.fieldType.setValue(store.first());
					this.createRefillWindow(this.fieldCreateRefill);
				} else {
					this.fieldType.expand();
				}
			}
		}
	}
});
