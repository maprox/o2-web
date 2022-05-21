/**
 * @class O.x.model.Fee
 * @extends O.model.Object
 */
C.define('O.x.model.Fee', {
	extend: 'O.model.Object',
	model: 'X.Fee'
});

C.define('X.Fee', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
			{name: 'id', type: 'int'},
			{name: 'id_old', type: 'int'},
			{name: 'name', type: 'string'},
			{name: 'enabled', type: 'bool'},
			{name: 'alias', type: 'string'},
			{name: 'state', type: 'int'},
			{name: 'amount', type: 'float', persist: false},
			{name: 'no_fee_count', type: 'int', persist: false}
		]
	}
});
