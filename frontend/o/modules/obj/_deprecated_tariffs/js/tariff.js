/**
 *
 * Tariff object
 * @class O.model.Tariff
 * @extends O.model.Object
 */
C.define('O.model.Tariff', {
	extend: 'O.model.Object'
});

C.define('Tariff', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
			{name: 'id', type: 'int'},
			{name: 'name', type: 'string'},
			{name: 'refillalert', type: 'float'},
			{name: 'individual', type: 'bool'},
			{name: 'used', type: 'bool'}
		]
	}
});
