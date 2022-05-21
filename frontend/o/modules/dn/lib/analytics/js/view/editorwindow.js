/**
 * @class O.dn.lib.analytics.EditorWindow
 * @extends O.common.lib.modelslist.EditorWindow
 */
C.define('O.dn.lib.analytics.EditorWindow', {
	extend: 'O.common.lib.modelslist.EditorWindow',
	alias: 'widget.dn-analytics-editorwindow',

/**
	* @constructor
	*/
	initComponent: function() {
		Ext.apply(this, {
			title: _('Analytic reports editor'),
			panelConfig: {
				xtype: 'dn-lib-analytics-tabs',
				tabsAliases: [
					'dn-analytics-tab-props'
				]
			},
			model: 'Dn.AnalyticReport',
			managerAlias: 'dn_analytic_report'
		});
		this.callParent(arguments);
	}
});