/**
 * Billing panel view
 * @class O.comp.Billing
 * @extends C.ui.Panel
 */
C.define('O.comp.Billing', {
	extend: 'C.ui.Panel',
	alias: 'widget.common-lib-billing',
	layout: 'border',

	/**
	 * @constructor
	 */
	initComponent: function() {/*
		this.list = Ext.create('O.lib.billing.List', {
			region: 'west',
			split: true,
			width: 300
		});*/

		this.tabs = Ext.create('O.lib.billing.Tabs', {
			region: 'center'
		});

		Ext.apply(this, {items: [
//			this.list,
			this.tabs
		]});
		this.callParent(arguments);
	}
});