/**
 * @class O.x.notification.param.MonGeofence
 * @extends O.x.notification.param.Abstract
 */
Ext.define('O.x.notification.param.MonGeofence', {
	extend: 'O.x.notification.param.AbstractGroupslist',
	alias: 'widget.x-notification-param-mon_geofence',

	listType: 'listgroupszones',
	tableAlias: 'mon_geofence'
});