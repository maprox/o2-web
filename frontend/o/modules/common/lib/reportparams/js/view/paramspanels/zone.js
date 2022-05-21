/**
 * @fileOverview Панель параметра отчета типа "Зона"
 *
 * @class O.reports.ZonePanel
 * @extends Ext.panel.Panel
 */
C.define('O.reports.ZonePanel', {
	extend: 'O.ui.groups.Zones',

	initComponent: function() {
		Ext.apply(this, {
			multiSelectObjects: true,
			multiSelectGroups: true,
			padding: '5 5 5 5',
			height: 270,
			border: true
		});
		this.callParent(arguments);
	}
});