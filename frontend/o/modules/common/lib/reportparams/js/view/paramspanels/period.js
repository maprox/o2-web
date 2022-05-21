/**
 * @fileOverview Панель параметра отчета типа "временной период"
 *
 * @class O.reports.PeriodPanel
 * @extends Ext.panel.Panel
 */
C.define('O.reports.PeriodPanel', {
	extend: 'Ext.panel.Panel',
	title: 'Period',

/**
	* Component initialization
	* @constructs
	*/
	initComponent: function() {
		Ext.apply(this, {
			padding: 5,
			title: _(this.title),
			autoHeight: true,
			layout: 'fit',
			dockedItems: [{
				xtype: 'periodchooser',
				hideReloadButton: true,
				hideLoadButton: true
			}]
		});
		this.callParent(arguments);
	}
});