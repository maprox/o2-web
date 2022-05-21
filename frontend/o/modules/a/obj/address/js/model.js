/**
 * @class O.a.model.Address
 * @extends O.model.Object
 */
C.define('O.a.model.Address', {
	extend: 'O.model.Object',
	model: 'A.Address'
});

C.define('A.Address', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
			{name: 'id', type: 'int'},
			{name: 'fullname', type: 'string'}
		]
	}
});
