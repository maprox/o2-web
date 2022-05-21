/**
 * @fileOverview Notification settings object class
 *
 * @class O.x.model.notification.Setting
 * @extends O.model.Object
*/

C.define('O.x.model.notification.Setting', {
	extend: 'O.model.Object',
	model: 'X.Notification.Setting'
});

C.define('X.Notification.Setting', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
			{name: 'id', type: 'int'},
			{name: 'id_user', type: 'int'},
			{name: 'id_type', type: 'int'},
			{name: 'address', type: 'string'},
			{name: 'active', type: 'boolean', defaultValue: false},
			{name: 'information', type: 'boolean', defaultValue: false},
			{name: 'medium', type: 'boolean', defaultValue: false},
			{name: 'high', type: 'boolean', defaultValue: false},
			{name: 'critical', type: 'boolean', defaultValue: false},
			{name: 'state', type: 'int', defaultValue: 1}
		]
	}
});
