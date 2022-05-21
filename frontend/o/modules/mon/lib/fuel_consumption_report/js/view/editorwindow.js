/**
 * @class O.mon.lib.waylist.EditorWindow
 * @extends O.common.lib.modelslist.EditorWindow
 */
C.define('O.mon.lib.fuel.consumption.report.EditorWindow', {
	extend: 'O.common.lib.modelslist.EditorWindow',
	alias: 'widget.mon_fuel_consumption_report-editorwindow',

/**
	* @constructor
	*/
	initComponent: function() {
		Ext.apply(this, {
			title: _('Fuel consumption report editor'),
			panelConfig: {
				tabsAliases: [
					//'mon-fuel-consumption-report-tab-props',
					'mon-fuel-consumption-report-tab-item'
				]
			},
			model: 'Mon.Fuel.Consumption.Report',
			managerAlias: 'mon_fuel_consumption_report'
		});
		this.callParent(arguments);
	}
});