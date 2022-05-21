/**
 */
/**
 * Store for grid of warehouses relative to request
 */

new Ext.data.Store({
	storeId: 'pricesrequestedit',
	fields: [
		{name: 'id', type: 'int'},
		{name: 'id_request', type: 'int'},
		{name: 'id_firm', type: 'int'},
		{name: 'id_region', type: 'int'},
		{name: 'name', type: 'string'},
		{name: 'address', type: 'string'},
		{name: 'note', type: 'string'},
		{name: 'amount', type: 'int'}
	],
	sortOnLoad: true,
	sorters: [{property: 'name', direction: 'ASC'}],
	proxy: O.proxy.Ajax.get('pricesrequests', 'edit')
});

