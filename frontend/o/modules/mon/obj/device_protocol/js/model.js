/**
 * @class O.mon.model.DeviceProtocol
 * @extends O.model.Object
 */
C.define('O.mon.model.DeviceProtocol', {
	extend: 'O.model.Object',
	model: 'Mon.DeviceProtocol'
});

C.define('Mon.DeviceProtocol', {
	extend: 'Ext.data.Model',
	fields: [
		{name: 'id', type: 'int'},
		{name: 'name', type: 'string'},
		{name: 'alias', type: 'string'},
		{name: 'sensors', type: 'object'},
		{name: 'state', type: 'int'}
	]
});