/**
 * @class O.x.model.Company
 * @extends O.model.Object
 */
C.define('O.x.model.Company', {
	extend: 'O.model.Object',
	model: 'X.Company'
});

C.define('X.Company', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
			{name: 'id', type: 'int'},
			// Normal fields
			{name: 'id_firm', type: 'int'},
			{name: 'id_director', type: 'int'},
			{name: 'name', type: 'string'},
			{name: 'fullname', type: 'string'},
			// Joined fields
			{name: 'id_address_legal$fullname', type: 'string'},
			{name: 'id_address_physical$fullname', type: 'string'},
			// Normal fields
			{name: 'id_address_physical', type: 'address', useNull: true},
			{name: 'id_address_legal', type: 'address', useNull: true},
			{name: 'director', type: 'object'},
			{name: 'email', type: 'auto'},
			{name: 'phone', type: 'auto'},
			{name: 'bank', type: 'object'},
			{name: 'inn', type: 'string'},
			{name: 'kpp', type: 'string'},
			{name: 'ogrn', type: 'string'},
			{name: 'okpo', type: 'string'},
			{name: 'okved', type: 'string'},
			{name: 'state', type: 'int', useNull: true},
			{name: 'iseditable', type: 'bool'}
		]
	}
});
