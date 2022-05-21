/**
 * @class O.comp.Billing
 * @extends C.ui.Panel
 */
C.utils.inherit('O.comp.Billing', {

	updateCuratorName: 'billing_account_update',

/**
	* @construct
	*/
	initComponent: function() {
		var me = this;
		this.callOverridden(arguments);

		this.tabs.on('account_changed', function() {
			// Pass information about account change further
			this.fireEvent('account_changed');
		}, this);

		if (this.isFirms) {
			this.tabs.enablePayConfirmation();
		}

		O.manager.Model.getCurator(this.updateCuratorName).addListener(
			'update', this.onUpdateBillingAccount, this);

		C.bind('billing_account', this);

		var firmId = C.getSetting('f.id');

		this.loadFirm(firmId);
	},

/**
	* On billing account update
	*/
	onUpdateBilling_account: function(data) {
		this.loadFirm(this.tabs.firmId);
	},

/**
	* Refresh history
	*/
	onUpdateBillingAccount: function() {
		this.tabs.refresh();
		//this.list.selectFirst();
	},

/**
	* Загрузка записи фирмы в биллинг
	*/
	loadBilling: function(record, tariffs) {
		if (this.isFirms) {
			this.tabs.setLoading(true);
		}
		var firmId = record.get('id') || 0;
		this.tabs.firmId = firmId;
		// Set billing disabled flag and firm record
		this.tabs.firmRecord = record;
		this.tabs.billingDisabled = record.get('billing_disabled');
		this.loadFirm(firmId);
		/*
			this.list.firmId = firmId
			this.list.firms = this.firms;
			this.list.loadModels();
		*/
	},

	/**
	 * Loads firm's billing
	 * @param {Number} firmId
	 */
	loadFirm: function(firmId) {
		var params = (firmId > 0) ? {$firm: firmId} : null;
		C.get('billing_account', function(models, success) {
			if (!success) { return; }
			this.tabs.loadTabs(new Billing.Account(models.first()));
		}, this, params);
	},

/**
	* Sends to tabPanel command to clear input data
	*/
	clearTabs: function() {
		this.tabs.clearData();
	},

/**
	* Activating module panel
	* @param {Object[]} params An array of module params {name: '', value: ''}
	*/
	moduleActivate: function(params) {
		this.callParent(arguments);
		if (params && params.length) {
			var param = params[0];
			if (param.name == 'issue' && param.value > 0) {
				if (this.tabs && this.tabs.issueInvoice) {
					this.tabs.issueInvoice(param.value);
				}
			}
		}
	}
});
