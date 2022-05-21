C.define('EventModel', {
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
				// Login and logout events
				if (record.get('eventid') == 31 || record.get('eventid') == 32)
				{
					if (record.get('eventval')) {
						record.data.eventval
							= Ext.JSON.decode(record.get('eventval'));
					}
				}

				return O.convert.eventText(record, O.lng.eventTemplates.panel);
			}}
		]
	}
});

Ext.create('Ext.data.Store', {
	model: 'EventModel',

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
	storeId: 'storeEvents',
	sorters: [{
		property: 'dt',
		direction: 'DESC'
	}]
});
