/**
 * Companies list
 * @class O.x.act.group_mon_device.Panel
 * @extends O.common.lib.modelslist.Panel
 */
C.define('O.x.act.group_mon_device.Panel', {
	extend: 'O.common.lib.modelslist.Panel',
	alias: 'widget.x-group-mon-device',

	model: 'X.Group.Mon.Device',
	managerAlias: 'x_group_mon_device',
	tabsAliases: [
		'x-group-mon-device-tab-props',
		'x-group-mon-device-tab-users'
	]
});