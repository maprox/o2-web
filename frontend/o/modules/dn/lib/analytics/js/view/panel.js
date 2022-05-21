/**
 * Analytic reports editor panel
 * @class O.dn.lib.analytics.Panel
 * @extends O.common.lib.modelslist.Panel
 */
C.define('O.dn.lib.analytics.Panel', {
	extend: 'O.common.lib.modelslist.Panel',
	alias: 'widget.dn-analytics',

	model: 'Dn.AnalyticReport',
	managerAlias: 'dn_analytic_report',

/**
	* Tabs aliases
	* @type String[]
	*/
	tabsAliases: [
		'dn-analytics-tab-props',
		'dn-analytics-tab-settings',
		'dn-analytics-tab-data'
	],

	tabsConfig: {
		xtype: 'dn-lib-analytics-tabs'
	},

/**
	* @constructor
	*/
	initComponent: function() {
		this.listConfig = {
			hideHeaders: false,
			columns: {
				defaults: {
					menuDisabled: true,
					flex: 1,
					field: {
						allowBlank: false
					}
				}, items: [{
					header: _('Name'),
					dataIndex: 'name'
				}/*, {
					header: _('Report type'),
					dataIndex: 'id_type',
					editor: {
						xtype: 'combobox'
					}
				}*/]
			}
		};
		this.callParent(arguments);
	}
});