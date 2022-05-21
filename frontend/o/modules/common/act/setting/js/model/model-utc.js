/**
 * UTC model
 */
C.define('Utc', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
			{name: 'utcid', type: 'int'},
			{name: 'utcname', type: 'string'},
			{name: 'utcvalue', type: 'string'}
		]
	}
});
