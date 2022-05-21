C.define('O.comp.FirmsTabBilling', {
	extend: 'O.comp.FirmsTabProxy',
	alias: 'widget.act-firmseditor-tab-billing',

/**
	* @constructor
	*/
	initComponent: function() {
		Ext.apply(this, {
			items: [{
				xtype: 'common-lib-billing',
				isFirms: true,
				updateCuratorName: 'billing_account_children_update'
			}]
		});

		this.callParent(arguments);
	},

/**
	* Loads data from record
	* @param {Ext.data.Model} record
	* @param {Boolean} noReset (optional) If true, use field.setValue method
	*     for forms to disable dirty change. Defaults to false
	*/
	selectRecord: function(record, noReset) {
		this.worker.loadBilling(record);
		//this.callParent(arguments);
	},

    /**
     * Updates record with form data
     * @param {Ext.data.Model} record
     */
    updateRecord: function(record) {}
});
