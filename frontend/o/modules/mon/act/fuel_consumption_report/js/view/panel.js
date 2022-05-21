/**
 * Monitoring waylist module
 * @class O.mon.waylist.Panel
 * @extends C.ui.Panel
 */
C.define('O.mon.fuel.consumption.report.Panel', {
	extend: 'C.ui.Panel',
	alias: 'widget.mon-fuel-consumption-report-panel',

/**
	* @constructor
	*/
	initComponent: function() {
		Ext.apply(this, {
			layout: 'fit',
			items: [{
				xtype: 'mon_fuel_consumption_report_list'
			}]
		});
		this.callParent(arguments);
		// init variables
		this.list = this.down('mon_fuel_consumption_report_list');
	}
});