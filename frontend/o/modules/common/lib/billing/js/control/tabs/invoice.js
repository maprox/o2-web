/**
 * @class O.lib.billing.tab.Invoice
 */
C.utils.inherit('O.lib.billing.tab.Invoice', {

/*  Language specific variables */
	msgAskDelete: 'Do you realy want to delete selected billing invoice?',

/**
	* @constructs
	*/
	initComponent: function() {
		this.callOverridden(arguments);
		this.grid.getSelectionModel().on({
			selectionchange: this.onGridSelectionChange,
			scope: this
		});
	},

/**
	* Enables pay confirmation in invoices
	*/
	enablePayConfirmation: function() {
		this.payConfirmationEnabled = true;
	},

/**
	* Loads history by account identifier
	* @param {Integer} accountId
	*/
	loadByAccountId: function(accountId) {
		this.gridStore.getProxy().extraParams['$filter'] =
			/*'edt gt now and */'id_account eq ' + accountId;
		this.gridStore.getProxy().extraParams.accountId = accountId;
		this.gridStore.getProxy().extraParams.$firm =
			this.selected.get('id_firm');

		this.gridStore.load();
	},

/**
	* Reloads invoices using same account id
	*/
	loadCurrentId: function(selectId) {
		selectId = selectId || false;

		if (this.gridStore.getProxy().extraParams.accountId) {

			var record = this.getSelectedRecord();
			if (record) {
				this.lastSelectedIndex = this.gridStore.indexOf(record);
			}

			this.gridStore.load({
				scope: this,
				callback: function() {
					if (selectId) {
						this.lastSelectedIndex =
							this.gridStore.find('id', selectId);
						this.grid.getSelectionModel().select(
							this.lastSelectedIndex);
					} else if (this.lastSelectedIndex !== null
						&& this.gridStore.getCount() > this.lastSelectedIndex) {
						this.grid.getSelectionModel().select(
							this.lastSelectedIndex);
					}
				}
			});
		}
	},

/**
	* Deletes invoice
	*/
	deleteInvoice: function() {
		var record = this.getSelectedRecord();
		if (!record) { return; }
		O.msg.confirm({
			msg: this.msgAskDelete,
			fn: function(buttonId) {
				if (buttonId != 'yes') { return; }
				this.gridStore.remove(record);
				this.gridStore.sync();
			},
			scope: this
		});
	},

/**
	* Confirms that invoice was succesfully paid
	*/
	labelPaidInvoice: function() {
		var record = this.getSelectedRecord();
		if (!record) { return; }

		var window = Ext.create('O.billing.misc.MarkPaid', {
			data: record.data,
			firmid: this.firmid
		});
		window.on('invoice_paid', function(params) {
			record = this.gridStore.findRecord('id', params.id);
			if (record) {
				record.set('paydt', params.paydt);
				record.set('status', 3);

				record.commit();
				this.onGridSelectionChange();

				this.fireEvent('account_changed');
				this.fireEvent('history_changed');
			}
		}, this);
	},

/**
	* Processes to payment
	*/
	activateInvoice: function() {
		var record = this.getSelectedRecord();

		if (!record) { return; }

		Ext.create('O.window.PendingPayment', {data: record.data});
	},

/**
	* Open print window
	*/
	printInvoice: function() {
		var record = this.getSelectedRecord();

		if (!record) { return; }

		window.open(Ext.String.format("/reports/export?data={0}",
			escape(Ext.encode({
				report: '/reports/observer/docsnet/invoice',
				format: 'PDF',
				params: {
					//invoiceid: record.get('id')
					billing_invoice: record.get('id')
				}
			})))
		);
	},

/**
	* Обработчик смены текущей строки грида
	*/
	onGridSelectionChange: function(sm, selections) {
		var record = this.getSelectedRecord();

		this.doButton.disable();
		this.paidButton.disable();
		this.cancelButton.disable();
		this.printButton.disable();

		if (record != null) {
			var store = C.getStore('billing_payment_type'),
				payment_type = store.getAt(
					store.find('id', record.get('id_payment_type')));

			if (payment_type.get('param') == 'print') {
				this.doButton.hide();
				this.printButton.show();

				if (C.userHasRight('billing_invoice_paid') &&
					this.payConfirmationEnabled &&
					record.get('status') != 3) {

					this.paidButton.show();
				} else {
					this.paidButton.hide();
				}
			} else {
				this.doButton.show();
				this.printButton.hide();
				this.paidButton.hide();
			}

			if (record.get('status') != 3) {
				this.doButton.enable();
				this.paidButton.enable();
				this.cancelButton.enable();
			};
			this.printButton.enable();
		}
	},

/**
	* Возвращает текущую выбранную запись в гриде
	* @return {Object Ext.data.Model}
	*/
	getSelectedRecord: function() {
		var record = null;
		var sm = this.grid.getSelectionModel();
		if (sm.hasSelection) {
			record = sm.getSelection()[0];
		}
		return record;
	}
});
