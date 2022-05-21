/**
 * @class O.x.model.Tariff
 * @extends O.model.Object
 */
C.define('O.x.model.Tariff', {
	extend: 'O.model.Object',
	model: 'X.Tariff'
});

C.define('X.Tariff', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
			{name: 'id', type: 'int'},
			{name: 'id_old', type: 'int'},
			{name: 'id_package', type: 'int'},
			{name: 'name', type: 'string'},
			{name: 'individual', type: 'int', defaultValue: 0},
			{name: 'identifier', type: 'string'},
			{name: 'description', type: 'string'},
			{name: 'fee'},
			{name: 'modules'},
			{name: 'tariff_option'},
			{name: 'free_days', type: 'int'},
			{name: 'limitvalue', type: 'float'},
			{name: 'state', type: 'int'}
		]
	}
});
