/**
 * Workers list
 * @class O.dn.act.workers.Panel
 * @extends O.common.lib.modelslist.Panel
 */
C.define('O.dn.act.workers.Panel', {
	extend: 'O.common.lib.person.Panel',
	alias: 'widget.dn-workers',

	model: 'Dn.Worker',
	managerAlias: 'dn_worker',
	tabsAliases: [
		'dn-workers-tab-props',
		'common-lib-person-tab-props'
	]
});