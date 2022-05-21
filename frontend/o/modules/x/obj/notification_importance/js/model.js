/**
 * @class O.x.model.NotificationImportance
 * @extends O.model.Object
 */
C.define('O.x.model.NotificationImportance', {
	extend: 'O.model.Object',
	model: 'X.NotificationImportance'
});

C.define('X.NotificationImportance', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
			{name: 'id', type: 'int'},
			{name: 'name', type: 'string'}
		]
	}
});
