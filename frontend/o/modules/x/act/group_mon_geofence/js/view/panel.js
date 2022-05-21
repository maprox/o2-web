/**
 * Geofences groups
 * @class O.x.act.group_mon_geofence.Panel
 * @extends O.common.lib.modelslist.Panel
 */
C.define('O.x.act.group_mon_geofence.Panel', {
	extend: 'O.common.lib.modelslist.Panel',
	alias: 'widget.x-group-mon-geofence',

	model: 'X.Group.Mon.Geofence',
	managerAlias: 'x_group_mon_geofence',
	tabsAliases: [
		'x-group-mon-geofence-tab-props',
		'x-group-mon-geofence-tab-users'
	]
});