/**
 * Device sensor object
 * @class O.mon.model.DeviceSensor
 * @extends O.model.Object
 */
C.define('O.mon.model.DeviceSensor', {
	extend: 'O.model.Object',
	model: 'Mon.DeviceSensor'
});

C.define('Mon.DeviceSensor', {
	extend: 'Ext.data.Model',
	fields: [
		{name: 'id', type: 'int'},
		{name: 'name', type: 'string'},
		{name: 'param', type: 'string'},
		{name: 'manual', type: 'bool'},
		{name: 'val', type: 'string'},
		{name: 'val_max', type: 'float', useNull: true},
		{name: 'val_min', type: 'float', useNull: true},
		{name: 'convert', type: 'bool'},
		{name: 'smoothing', type: 'bool'},
		{name: 'conversion', type: 'object'},
		{name: 'unit', type: 'string'},
		{name: 'precision', type: 'int'},
		{name: 'display', type: 'bool'},
		{name: 'state', type: 'int'}
	]
});