/**
 * Store for grid of responses to requests
 */

C.define('pricesRequestAnswerLinesRemote', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
			{name: 'id', type: 'int'},
			{name: 'id_request', type: 'int'},
			{name: 'id_response', type: 'int'},
			{name: 'id_request_value', type: 'int'},
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
			{name: 'amount', type: 'float', defaultValue: 0},
			{name: 'price', type: 'float'}
		]
	}
});

C.define('pricesRequestAnswerLines', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
			{name: 'id', type: 'int'},
			{name: 'id_request', type: 'int'},
			{name: 'id_response', type: 'int'},
			{name: 'id_request_value', type: 'int'},
			{name: 'id_place', type: 'int'},
			{name: 'id_product', type: 'int'},
			{name: 'code', type: 'string'},
			{name: 'product', type: 'string'},
			{name: 'nomenclature', type: 'string'},
			{name: 'amount', type: 'float', defaultValue: 0},
			{name: 'price', type: 'float'}
		]
	}
});

// Первичный Store, получающий информацию от сервера
new Ext.data.Store({
	storeId: 'pricesRequestAnswerLinesRemote',
	model: 'pricesRequestAnswerLinesRemote',
	remoteFilter: true,
	proxy: O.proxy.Ajax.get('pricesresponses', 'line')
});

// Вторичный Store, выполняющий пагинацию и фильтры поверх данных первого
new Ext.data.Store({
	storeId: 'pricesRequestAnswerLines',
	model: 'pricesRequestAnswerLines',
	filterOnLoad: false,
	remoteSort: true,
	remoteFilter: true,
	pageSize: 40,
	proxy: new O.proxy.Store({
		storeId: 'pricesRequestAnswerLinesRemote'
	})
});

