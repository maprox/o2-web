/**
 * Global store of notification aliases
 * @class O.x.notification.model.StoreAlias
 * @extend Ext.data.Store
 */
C.define('O.x.notification.model.StoreAlias', {
	extend: 'Ext.data.Store',
	storeId: 'store-x_notification_alias',
	fields: [{name: 'alias'}, {name: 'description'}],
	proxy: {type: 'memory'}
}, function() { new this });

/**
 * Executes after loading of all script pieces,
 * including language files.
 */
C.onload(function() {
	// let's add some data to a store
	var store = Ext.getStore('store-x_notification_alias');
	if (store) {
		store.loadData([{
			alias: '%ADDRESS%',
			description: _('Address of the device coordinates')
		}, {
			alias: '%DEVICE%',
			description: _('Device name')
		}, {
			alias: '%LAT%',
			description: _('Latitude of the device coordinates')
		}, {
			alias: '%LON%',
			description: _('Longitude of the device coordinates')
		}, {
			alias: '%LINK_GOOGLE%',
			description: _('Url link to Google Maps')
		}, {
			alias: '%LINK_OSM%',
			description: _('Url link to OpenStreetMap')
		}, {
			alias: '%LINK_YANDEX%',
			description: _('Url link to Yandex Maps')
		}, {
			alias: '%SPEED%',
			description: _('Speed of the device')
		}, {
			alias: '%TIME%',
			description: _('Time of the packet')
		}, {
			alias: '%SERVER_TIME%',
			description: _('Time of the event')
		}, {
			alias: '%LAST_CONNECT%',
			description: _('Время последнего соединения')
		}, {
			alias: '%ZONE%',
			description: _('Geofence name')
		}]);
	}
});
