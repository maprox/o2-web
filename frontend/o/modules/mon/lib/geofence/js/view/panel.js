/**
 *
 * Geofence editor panel
 * @class O.mon.geofence.Panel
 * @extends O.common.lib.modelslist.Panel
 */
C.define('O.mon.geofence.Panel', {
	extend: 'O.common.lib.modelslist.Panel',
	alias: 'widget.mon-geofence',

	model: 'Mon.Geofence',
	managerAlias: 'mon_geofence',

	tabsAliases: [
		'mon-geofence-tab-map',
		'mon-geofence-tab-access'
	]
});