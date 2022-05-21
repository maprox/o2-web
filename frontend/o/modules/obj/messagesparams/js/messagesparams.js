C.define('MessagesParams', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
			{name: 'name', type: 'string'},
			{name: 'alias', type: 'string'}
		]
	}
});

Ext.create('Ext.data.Store', {
	storeId: 'storeMessagesParams',
	model: 'MessagesParams',
	data: [
		{name: 'Object name', alias: '%DEVICE%'},
		{name: 'Event time', alias: '%TIME%'},
		{name: 'Speed', alias: '%SPEED%'},
		{name: 'Object location at the time of the event', alias: '%LOCATION%'},
		{name: 'Object address at the time of the event', alias: '%ADDRESS%'},
		{name: 'Zone where the event occurred', alias: '%ZONE%'},
		{name: 'Account number', alias: '%ACCOUNT_NUM%'},
		{name: 'Account balance', alias: '%ACCOUNT_BALANCE%'},
		{name: 'Billing link', alias: '%BILLING_URL%'}
	]
});
