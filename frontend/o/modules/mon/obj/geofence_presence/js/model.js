/**
 * Geofence model object
 * @class O.mon.model.geofence.Presence
 * @extends O.model.Object
 */
C.define('O.mon.model.geofence.Presence', {
	extend: 'O.model.Object',
	model: 'Mon.geofence.Presence'
});

C.define('Mon.geofence.Presence', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
			{name: 'id', type: 'int'},
			{name: 'id_device', type: 'int'},
			{name: 'id_geofence', type: 'int'},
			{name: 'state', type: 'int'},
			{name: 'sdt', type: 'date', dateFormat: 'c'}
		]
	}
});
