/**
 * @class O.mon.model.DeviceImage
 * @extends O.model.Object
 */
C.define('O.mon.model.DeviceImage', {
	extend: 'O.model.Object',
	model: 'Mon.DeviceImage'
});

C.define('Mon.DeviceImage', {
	extend: 'Ext.data.Model',
	fields: [
		{name: 'id', type: 'int'},
		{name: 'id_device', type: 'int'},
		{name: 'source', type: 'string'},
		{name: 'time', type: 'string'},
		{name: 'hash', type: 'string'},
		{name: 'mime', type: 'string'},
		{name: 'note', type: 'string'},
		{name: 'state', type: 'int'}
	]
});