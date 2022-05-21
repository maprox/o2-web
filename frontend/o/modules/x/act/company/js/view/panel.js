/**
 * Companies list
 * @class O.x.act.company.Panel
 * @extends O.common.lib.modelslist.Panel
 */
C.define('O.x.act.company.Panel', {
	extend: 'O.common.lib.modelslist.Panel',
	alias: 'widget.x-company',

	model: 'X.Company',
	managerAlias: 'x_company',
	tabsAliases: [
		'x-company-tab-props',
		'x-company-tab-manager',
		'x-company-tab-contacts',
		'x-company-tab-bank'
	]
});