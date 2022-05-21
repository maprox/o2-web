/**
 * Store for grid of responses to requests
 */

new Ext.data.Store({
	storeId: 'pricesrequestanswer',
	fields: [
		{name: 'id_response', type: 'int'},
		{name: 'id_request', type: 'int'},
		{name: 'id_firm', type: 'int'},
		{name: 'firm', type: 'string'},
		{name: 'id_place', type: 'int'},
		{name: 'dt', type: 'date', dateFormat: 'c'}
	],
	sortOnLoad: true,
	sorters: [{property: 'dt', direction: 'ASC'}],
	groupField: 'id_firm',
	proxy: O.proxy.Ajax.get('pricesrequests', 'answer')
});

