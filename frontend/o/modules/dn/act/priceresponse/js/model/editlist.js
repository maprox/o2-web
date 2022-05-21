/**
 *
 * Two stores for grid of prices response details
 */

C.define('pricesResponseList', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
			{name: 'id_request', type: 'int'},
			{name: 'id_response', type: 'int'},
			{name: 'id_place', type: 'int'}
		]
	}
});

// Первичный Store, получающий информацию от сервера
new Ext.data.Store({
	storeId: 'pricesResponseListRemote',
	model: 'pricesResponseList',
	autoSync: true,
	remoteFilter: true,
	proxy: O.proxy.Ajax.get('pricesresponses', 'list')
});

// Вторичный Store, выполняющий пагинацию и фильтры поверх данных первого
new Ext.data.Store({
	storeId: 'pricesResponseList',
	model: 'pricesResponseList',
	filterOnLoad: false,
	autoSync: true,
    remoteSort: true,
	remoteFilter: true,
    pageSize: 40,
    groupField: 'id_place',
	proxy: new O.proxy.Store({
		storeId: 'pricesResponseListRemote'
	})
});
