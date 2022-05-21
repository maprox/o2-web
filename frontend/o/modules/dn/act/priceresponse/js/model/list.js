/**
 *
 * Store for grid of prices Responses list
 */

new Ext.data.Store({
	storeId: 'pricesResponses',
	fields: [
		{name: 'id', type: 'int'},
		{name: 'id_request', type: 'int'},
		{name: 'num', type: 'int', defaultValue: 0},
		{name: 'sdt', type: 'date', dateFormat: 'c'},
		{name: 'edt', type: 'date', dateFormat: 'c'},
		{name: 'status', type: 'int', defaultValue: 1}
	],
	autoSync: true,
	autoLoad: true,
	proxy: O.proxy.Ajax.get('pricesresponses')
});
