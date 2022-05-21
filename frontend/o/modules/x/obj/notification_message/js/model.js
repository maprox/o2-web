/**
 * @fileOverview Notification defaul messages
 *
 * @class O.x.model.notification.Message
 * @extends O.model.Object
*/

C.define('O.x.model.notification.Message', {
	extend: 'O.model.Object',
	model: 'X.Notification.Message'
});

C.define('X.Notification.Message', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
			{name: 'id', type: 'string'},
			{name: 'alias', type: 'string'},
			{name: 'num', type: 'int'},
			{name: 'text', type: 'string'},
			{name: 'title', type: 'string'}
		]
	}
});
