/**
 * @class O.mon.model.fuel.consumption.report.Item
 * @extends O.model.Object
 */
C.define('O.mon.model.device.sensor.history.Setting', {
	extend: 'O.model.Object',
	model: 'Mon.Device.Sensor.History.Setting'
});

C.define('Mon.Device.Sensor.History.Setting', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
			{name: 'id', type: 'int'},
			{name: 'id_user', type: 'int'},
			{name: 'id_device_sensor', type: 'int'},
			{name: 'display', type: 'bool'},
			{name: 'condition', type: 'string'},
			{name: 'value', type: 'string'},
			{name: 'state', type: 'int', useNull: true}
		]
	}
});
