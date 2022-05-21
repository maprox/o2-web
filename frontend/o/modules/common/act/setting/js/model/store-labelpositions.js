/*
 * Хранилище возможных доступных положений для блока информации об устройстве
 */
Ext.create('Ext.data.Store', {
	fields: ['id', 'position'],
	storeId: 'deviceLabelPositionsStore',
	data : [
		{ id: 1, position: 'left' },
		{ id: 2, position: 'right' },
		{ id: 3, position: 'top' },
		{ id: 4, position: 'bottom' }
	],
	proxy: {
		type: 'memory'
	}
});