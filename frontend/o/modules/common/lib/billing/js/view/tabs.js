/**
 * @class O.lib.billing.Tabs
 * @extends C.ui.Panel
 */
C.define('O.lib.billing.Tabs', {
	extend: 'C.ui.Panel',
	layout: {
		type: 'fit',
		align: 'stretch'
	},

	/**
	 * @constructor
	 */
	initComponent: function() {
		this.tabInfo = Ext.create('O.lib.billing.tab.Info');
		this.tabInvoice = Ext.create('O.lib.billing.tab.Invoice');
		this.tabAct = Ext.create('O.lib.billing.tab.Act');
		this.tabHistory = Ext.create('O.lib.billing.tab.History');

		Ext.apply(this, {
			items: [{
				xtype: 'otabpanel',
				items: [
					this.tabInfo,
					this.tabInvoice,
					this.tabAct,
					this.tabHistory
				]
			}]
		});

		this.callParent(arguments);
		this.tabs = this.child();
	}
});
