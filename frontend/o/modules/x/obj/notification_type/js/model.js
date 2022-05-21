/**
 * @class O.x.model.NotificationType
 * @extends O.model.Object
 */
C.define('O.x.model.NotificationType', {
	extend: 'O.model.Object',
	model: 'X.NotificationType'
});

C.define('X.NotificationType', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
			{name: 'id', type: 'int'},
			{name: 'name', type: 'string'},
			{name: 'alias', type: 'string'},
			{name: 'id_package', type: 'int'},
			{name: 'state', type: 'int'}
		]
	}
});
