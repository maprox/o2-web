/*
 * Хранилище возможных доступных положений для блока информации об устройстве
 */
Ext.create('Ext.data.Store', {
	fields: ['value', 'text'],
	storeId: 'eventsPeriodsStore',
	data : [
		{ value: 1, text: 'For a hour' },
		{ value: 12, text: 'For 12 hours' },
		{ value: 24, text: 'For 24 hours' },
		{ value: 48, text: 'For 2 days' },
		{ value: 168, text: 'For a week' }
	],
	proxy: {
		type: 'memory'
	}
});