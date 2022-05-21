C.define('O.mon.trackhistory.SummaryModel', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
			{name: 'odometer', type: 'integer'},
			{name: 'odometer_nodata', type: 'integer'},
			{name: 'odometer_selected', type: 'integer'},
			{name: 'moving', type: 'integer'},
			{name: 'still', type: 'integer'}
		]
	}
});