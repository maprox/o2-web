/**
 * Warehouse list object
 * @class O.dn.model.WarehouseList
 * @extends O.model.Object
 */
C.define('O.dn.model.WarehouseList', {
	extend: 'O.model.Object',
	model: 'Dn.WarehouseList'
});

C.define('Dn.WarehouseList', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
			{name: 'id', type: 'int'},
			{name: 'id_firm', type: 'int'},
			{name: 'id_region', type: 'int'},
			{name: 'name', type: 'string'},
			{name: 'address', type: 'string'},
			{name: 'note', type: 'string'},
			{name: 'distributed', type: 'int'},
			{name: 'lat', type: 'float'},
			{name: 'lon', type: 'float'},
			{name: 'iseditable', type: 'bool', defaultValue: true},
			{name: 'state', type: 'int'}

		]
	}
});
