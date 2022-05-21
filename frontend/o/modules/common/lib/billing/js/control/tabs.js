/**
 * @class O.lib.billing.Tabs
 */
C.utils.inherit('O.lib.billing.Tabs', {

/**
	* @constructs
	*/
	initComponent: function() {
		this.callOverridden(arguments);
		this.tabInfo.on({
			invoice_created: 'refreshInvoice',
			history_changed: 'refreshHistory',
			account_changed: 'refreshAccount',
			limit_changed: 'refresh',
			scope: this
		});
		this.tabInvoice.on({
			history_changed: 'refreshHistory',
			account_changed: 'refreshAccount',
			scope: this
		});
	},

/**
	* Загрузка устройства в табпанель
	* @param {Object} record Объект устройства
	*/
	loadTabs: function(record) {
		if (!record.getId()) {
			this.disable();
		} else {
			Ext.defer(function() {
				this.selected = record;

				var firmId = record.get('id_firm');
				this.tabInfo.firmid = firmId;
				this.tabInfo.firmRecord = this.firmRecord;
				this.tabInfo.selected = this.selected;
				this.tabInfo.billingDisabled = this.billingDisabled;
				this.tabInfo.loadInfo(record);
				this.tabHistory.firmid = firmId;
				this.tabHistory.selected = this.selected;
				this.tabHistory.loadByAccountId(record.getId());
				this.tabInvoice.firmid = firmId;
				this.tabInvoice.selected = this.selected;
				this.tabInvoice.loadByAccountId(record.getId());
				this.tabAct.firmid = firmId;
				this.tabAct.selected = this.selected;
				this.tabAct.loadByAccountId(record.getId());
				// разблокировка панели
				this.enable();
				this.setLoading(false);
			}, 100, this); // facepalm, but leave it for some time
		}
	},

/**
	* Enables pay confirmation in invoices
	*/
	enablePayConfirmation: function() {
		this.tabInvoice.enablePayConfirmation();
	},

/**
	* Clears input data in all tabs
	*/
	clearData: function() {
		this.tabs.items.each(function(tab){
			if (typeof tab.clearData == "function") {
				tab.clearData();
			}
		});
	},

/**
	* Gives all tabs command to refresh
	*/
	refresh: function() {
		this.tabInvoice.loadCurrentId();
		this.tabHistory.loadCurrentId();
		if (this.selected) {
			this.tabInfo.loadInfo(this.selected);
		}
	},

/**
	* Gives invoice tab command to refresh
	*/
	refreshInvoice: function(invoiceId) {
		invoiceId = invoiceId || false;
		if (invoiceId) {
			this.tabInvoice.loadCurrentId(invoiceId);
			this.tabs.setActiveTab(this.tabInvoice);
		} else {
			this.tabInvoice.loadCurrentId();
		}
	},

/**
	* Tries to issue an invoice
	* @param {Number} value Invoice sum
	*/
	issueInvoice: function(value) {
		if (this.tabInfo && this.tabInfo.issueInvoice) {
			this.tabInfo.issueInvoice(value);
		}
	},

/**
	* Gives history tab command to refresh
	*/
	refreshHistory: function() {
		this.tabHistory.loadCurrentId();
	},

/**
	* Changes information in account object
	*/
	refreshAccount: function(data) {
		data = data || {};

		//if (data.id_tariff != this.selected.get('id_tariff')) {
		//	this.selected.set('new_tariff', data);
		//} else {
		//	this.selected.set('new_tariff', false);
		//}
		this.selected.beginEdit();
		Ext.iterate(data, function(key, value) {
			this.selected.set(key, value);
		}, this);
		this.selected.set('limittext', false);
		this.selected.endEdit();
		this.tabInfo.loadInfo(this.selected);

		// Pass information about account change further
		this.fireEvent('account_changed');
	}
});
