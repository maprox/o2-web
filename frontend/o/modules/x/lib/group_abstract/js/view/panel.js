/**
 * Panel
 * @class O.x.lib.group_abstract.Panel
 * @extends O.common.lib.modelslist.Panel
 */
C.define('O.x.lib.group_abstract.Panel', {
	extend: 'O.common.lib.modelslist.Panel',
	alias: 'widget.x-group-abstract',

	model: 'Undefined.Model',
	managerAlias: 'undefined_manager_alias',
	tabsAliases: [
		'x-group-abstract-tab-props',
		'x-group-abstract-tab-users'
	]
});