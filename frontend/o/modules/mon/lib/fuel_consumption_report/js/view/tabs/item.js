/**
 * @class O.mon.lib.fuel.consumption.report.tab.Item
 * @extends O.common.lib.modelslist.Tab
 */
C.define('O.mon.lib.fuel.consumption.report.tab.Item', {
	extend: 'O.common.lib.modelslist.Tab',
	alias: 'widget.mon-fuel-consumption-report-tab-item',

/*  Configuration */
	bodyPadding: 0,
	border: false,

/**
	* @constructor
	*/
	initComponent: function() {
		Ext.apply(this, {
			title: _('Vehicles'),
			itemId: 'item',
			layout: 'fit',
			items: [{
				xtype: 'mon-fuel-consumption-report-itemlist'
			}]
		});
		this.callParent(arguments);
		// init variables
		this.list = this.down('mon-fuel-consumption-report-itemlist');
	}
});
