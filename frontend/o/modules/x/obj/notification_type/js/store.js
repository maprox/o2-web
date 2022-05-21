/**
 * Global store of x_notification_type model data
 * @class C.data.X.notification.type.Store
 * @extend Ext.data.Store
 */
C.define('C.data.X.notification.type.Store', {
	extend: 'Ext.data.Store',
	storeId: 'store-x_notification_type',
	model: 'X.NotificationType',
	proxy: {type: 'memory'},
	data: []
}, function() { new this });

/**
 * Executes after loading of all script pieces,
 * including language files.
 */
C.onload(function() {
	// let's add some data to a store
	var store = Ext.getStore('store-x_notification_type');
	if (store) {
		store.loadData([{
			id: 1,
			name: _('Entrance and exit from the geo-fence'),
			alias: 'mon_geofence_inout',
			id_package: 4,
			state: 1
		}, {
			id: 2,
			name: _('Overspeed'),
			alias: 'mon_overspeed',
			id_package: 4,
			state: 1
		}, {
			id: 3,
			name: _('Alarm button'),
			alias: 'mon_alarm_button',
			id_package: 4,
			state: 1
		}, {
			id: 4,
			name: _('Connection loss'),
			alias: 'mon_connection_loss',
			id_package: 4,
			state: 1
		}, {
			id: 5,
			name: _('Sensor control'),
			alias: 'mon_sensor_control',
			id_package: 4,
			state: 1
		}, {
			id: 6,
			name: _('Satellite signal loss'),
			alias: 'mon_signal_loss',
			id_package: 4,
			state: 1
		}]);
	}
});