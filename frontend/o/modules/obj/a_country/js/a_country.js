/**
 * Product object
 * @class O.model.a.Country
 * @extends O.model.Object
 */
C.define('O.model.a.Country', {
	extend: 'O.model.Object'
});

C.define('A.Country', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
			{name: 'id', type: 'int'},
			{name: 'name', type: 'string'},
			{name: 'code', type: 'string'}
		]
	}
});
