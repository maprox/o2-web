/**
 *
 * Two stores for grid of prices request details
 */

C.define('pricesRequestEditLinesRemote', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
			{name: 'id', type: 'int'},
			{name: 'id_request', type: 'int'},
			{name: 'id_place', type: 'int'},
			{name: 'id_product', type: 'int'},
			{name: 'code', type: 'string', convert: function(value, record){
				return O.convert.productCode(record.get('id_product'));
			}},
			{name: 'product', type: 'string', convert: function(value, record){
				return O.convert.product(record.get('id_product'));
			}},
			{name: 'nomenclature', type: 'string', convert: function(value, record){
				return O.convert.productNom(record.get('id_product'));
			}},
			{name: 'amount', type: 'float', defaultValue: 0}
		]
	}
});

C.define('pricesRequestEditLines', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
			{name: 'id', type: 'int'},
			{name: 'id_request', type: 'int'},
			{name: 'id_place', type: 'int'},
			{name: 'id_product', type: 'int'},
			{name: 'code', type: 'string'},
			{name: 'product', type: 'string'},
			{name: 'nomenclature', type: 'string'},
			{name: 'amount', type: 'float', defaultValue: 0}
		]
	}
});

// Первичный Store, получающий информацию от сервера
new Ext.data.Store({
	storeId: 'pricesRequestEditLinesRemote',
	model: 'pricesRequestEditLinesRemote',
	autoSync: true,
	remoteFilter: true,
	proxy: O.proxy.Ajax.get('pricesrequests', 'line')
});

// Вторичный Store, выполняющий пагинацию и фильтры поверх данных первого
new Ext.data.Store({
	storeId: 'pricesRequestEditLines',
	model: 'pricesRequestEditLines',
	filterOnLoad: false,
	autoSync: true,
	remoteSort: true,
	remoteFilter: true,
	pageSize: 40,
	sorters: [{property: 'product', direction: 'ASC'}],
	proxy: new O.proxy.Store({
		storeId: 'pricesRequestEditLinesRemote'
	})
});
