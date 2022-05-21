/**
 * @class O.mon.model.Fuel
 * @extends O.model.Object
 */
C.define('O.mon.model.Fuel', {
	extend: 'O.model.Object',
	model: 'Mon.Fuel'
});

C.define('Mon.Fuel', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
			{name: 'id', type: 'int'},
			{name: 'id_firm', type: 'int'},
			{name: 'name', type: 'string'},
			{name: 'code', type: 'string'},
			{name: 'state', type: 'int'}
		]
	}
});
