C.define('ReportsHistory', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
			{name: 'dt', type: 'string'},
			{name: 'username', type: 'string'},
			{name: 'params', type: 'string'}
		]
	}
});
