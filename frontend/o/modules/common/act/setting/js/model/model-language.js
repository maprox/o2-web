/**
 * Language model
 */
C.define('Language', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
			{name: 'id', type: 'float'},
			{name: 'name', type: 'string'},
			{name: 'alias', type: 'string'}
		]
	}
});
