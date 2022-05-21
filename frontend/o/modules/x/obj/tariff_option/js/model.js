/**
 * @class O.x.model.tariff.Option
 * @extends O.model.Object
 */
C.define('O.x.model.tariff.Option', {
	extend: 'O.model.Object',
	model: 'X.tariff.Option'
});

C.define('X.tariff.Option', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
			{name: 'id', type: 'int'},
			{name: 'id_old', type: 'int'},
			{name: 'name', type: 'string'},
			{name: 'enabled', type: 'bool'},
			{name: 'identifier', type: 'string'},
			{name: 'description', type: 'string'},
			{name: 'state', type: 'int'},
			{name: 'value', type: 'int', persist: false}
		]
	}
});
