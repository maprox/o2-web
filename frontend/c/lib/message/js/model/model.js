/**
 * Model for message management
 * ===============================
 *
 * Description goes here
 *
 * @class C.model.Message
 * @extends Ext.data.Model
 */
Ext.define('C.model.Message', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
			{name: 'key', type: 'string'},
			{name: 'message'},
			{name: 'lifespan', type: 'int'},
			{name: 'type', type: 'string'}
		]
	},
	// remove if ExtJS using a config
	fields: [
		{name: 'key', type: 'string'},
		{name: 'message'},
		{name: 'lifespan', type: 'int'},
		{name: 'type', type: 'string'}
	]
});
