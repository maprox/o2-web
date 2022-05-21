/**
 * Access Level object
 * @class O.model.AccessLevel
 * @extends O.model.Object
 */
C.define('O.model.AccessLevel', {
	extend: 'O.model.Object'
});

C.define('AccessLevel', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
			{name: 'id', type: 'int'},
			{name: 'name', type: 'string'}
		]
	}
});
