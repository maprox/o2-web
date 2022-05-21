/**
 * @class O.a.model.City
 * @extends O.model.Object
 */
C.define('O.a.model.City', {
	extend: 'O.model.Object',
	model: 'A.City'
});

C.define('A.City', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
			{name: 'id_city', type: 'int'},
			{name: 'id_lang', type: 'int'},
			{name: 'id_country', type: 'int'},
			{name: 'name', type: 'string'},
			{name: 'state', type: 'int'}
		]
	}
});
