/**
 *
 * PackagesEditor panel view
 * @class O.common.act.tariff.Panel
 * @extends O.common.lib.modelslist.Panel
 */
C.define('O.common.act.tariff.Panel', {
	extend: 'O.common.lib.modelslist.Panel',
	alias: 'widget.act_admin_tariffseditor',

	model: 'X.Tariff',
	managerAlias: 'x_tariff',
	tabsAliases: [
		'common-tariff-tab-props'
	],
	listConfig: {
		xtype: 'common-tariff-list'
	}
});
