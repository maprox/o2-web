/**
 * @class O.x.act.group_mon_geofence.tab.Props
 * @extends O.x.lib.group_abstract.tab.Props
 */
C.define('O.x.act.group_mon_geofence.tab.Props', {
	extend: 'O.x.lib.group_abstract.tab.Props',
	alias: 'widget.x-group-mon-geofence-tab-props',

/**
	* Entity alias (e.g. mon_device)
	*/
	entityAlias: 'mon_geofence',

/**
	 * Entity model (e.g. Mon.Device)
	 */
	entityModel: 'Mon.Geofence',

	tabTitle: 'Geofences',

	includedTitle: 'Included geofences',

	availableTitle: 'Available geofences'
});