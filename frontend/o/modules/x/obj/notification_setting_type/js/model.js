/**
 * @fileOverview Types for notification settings object class
 *
 * @class O.x.model.notification.setting.Type
 * @extends O.model.Object
*/

C.define('O.x.model.notification.setting.Type', {
	extend: 'O.model.Object',
	model: 'X.Notification.Setting.Type'
});

C.define('X.Notification.Setting.Type', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
			{name: 'id', type: 'int'},
			{name: 'name', type: 'string'},
			{name: 'single', type: 'boolean', defaultValue: false},
			{name: 'state', type: 'int'}
		]
	}
});
