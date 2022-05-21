/**
 * Right object class
 * @class O.x.model.User
 * @extends O.model.Object
*/

C.define('O.x.model.User', {
	extend: 'O.model.Object',
	model: 'X.User'
});

C.define('X.User', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
			{name: 'id', type: 'int'},
			{name: 'id_firm', type: 'int'},
			{name: 'id_person', type: 'int'},
			{name: 'person', type: 'object'},
			{name: 'login', type: 'string'},
			{name: 'password', type: 'string', defaultValue: ''},
			{name: 'shortname', type: 'string'},
			{name: 'api_key', type: 'string'},
			{name: 'device_label_row_1', type: 'int'},
			{name: 'device_label_row_2', type: 'int'},
			{name: 'device_label_row_3', type: 'int'},
			{name: 'device_label_position', type: 'int'},
			{name: 'id_lang', type: 'int', defaultValue: 1},
			{name: 'theme', type: 'string'},
			{name: 'point_count', type: 'int'},
			{name: 'sync_time', type: 'float'},
			{name: 'event_period_length', type: 'int'},
			{name: 'need_password_change', type: 'int', defaultValue: 0},
			{name: 'need_notify_user', type: 'int', defaultValue: 0},
			{name: 'id_schedule', type: 'int'},
			{name: 'schedule', type: 'object'},
			{name: 'mailhash', type: 'string'},
			{name: 'role', type: 'int'},
			{name: 'id_utc', type: 'int'},
			{name: 'iseditable', type: 'int'},
			{name: 'id_map_engine', type: 'int'},
			{name: 'package'},
			{name: 'right_level'},
			{name: 'state', type: 'int'}
		]
	}
});
