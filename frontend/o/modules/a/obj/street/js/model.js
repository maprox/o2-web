/**
 * @class O.a.model.Street
 * @extends O.model.Object
 */
C.define('O.a.model.Street', {
	extend: 'O.model.Object',
	model: 'A.Street'
});

C.define('A.Street', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
			{name: 'id_street', type: 'int'},
			{name: 'id_lang', type: 'int'},
			{name: 'id_city', type: 'int'},
			{name: 'name', type: 'string'},
			{name: 'state', type: 'int'}
		]
	}
});
