C.define('EventModel', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
			{name: 'dt', type: 'date', dateFormat: 'c'},
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