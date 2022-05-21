/**
 * @class O.dn.model.vehicle.Driver
 * @extends O.model.Object
 */
C.define('O.mon.model.vehicle.Driver', {
	extend: 'O.model.Object',
	model: 'Mon.vehicle.Driver'
});

C.define('Mon.vehicle.Driver', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
			{name: 'id', type: 'int'},
			{name: 'id_vehicle', type: 'int'},
			{name: 'id_driver', type: 'int'},
			{name: 'sdt', type: 'date', dateFormat: 'c'},
			{name: 'sdt', type: 'date', dateFormat: 'c'},
			{name: 'state', type: 'int', useNull: true}
		]
	}
});
