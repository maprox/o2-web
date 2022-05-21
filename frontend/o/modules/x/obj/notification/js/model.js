/**
 * @class O.x.model.Notification
 * @extends O.model.Object
 */
C.define('O.x.model.Notification', {
	extend: 'O.model.Object',
	model: 'X.Notification'
});

C.define('X.Notification', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
			{name: 'id', type: 'int'},
			{name: 'id_firm', type: 'int'},
			{name: 'name', type: 'string'},
			{name: 'id_type', type: 'int', useNull: true},
			{name: 'id_importance', type: 'int', useNull: true},
			{name: 'id_schedule', type: 'int', useNull: true},
			{name: 'message_0', type: 'string'},
			{name: 'message_1', type: 'string'},
			{name: 'note', type: 'string'},
			{name: 'schedule', type: 'object'},
			{name: 'state', type: 'int', useNull: true},
			{name: 'iseditable', type: 'bool'},
			{name: 'params', type: 'auto'},
			{name: 'actions', type: 'auto'},
			// Joined fields
			{name: 'id_importance$name', type: 'string'},
			{name: 'id_address_physical$fullname', type: 'string'}
		]
	}
});
