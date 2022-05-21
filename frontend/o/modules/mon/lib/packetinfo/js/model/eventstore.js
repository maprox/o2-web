C.define('EventDeviceModel', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
			{name: 'dt', type: 'datetime', convert: O.convert.date},
			{name: 'ownerid', type: 'int'},
			{name: 'latitude', type: 'float', defaultValue: 0},
			{name: 'longitude', type: 'float', defaultValue: 0},
			{name: 'eventid', type: 'int'},
			{name: 'eventval', type: 'string'},
			{name: 'eventtext', type: 'string', convert: function(val, record) {
				return O.convert.eventText(record, O.lng.eventTemplates.device);
			}}
		]
	}
});

C.define('EventDeviceStore', {
	//extend: 'Ext.data.Store',
	model: 'EventDeviceModel',

	proxy: Ext.create('Ext.data.proxy.Ajax', {

		api: {
			read: '/events/'
		},

		actionMethods: {
			read: 'POST'
		},

		reader: {
			type: 'json',
			successProperty: 'success',
			root: 'data',
			totalProperty: 'count'
		}
	}),

	remoteSort: true,
	pageSize: 10,
	storeId: 'storeDeviceEvents',
	sorters: [{
		property: 'dt',
		direction: 'DESC'
	}]
});
