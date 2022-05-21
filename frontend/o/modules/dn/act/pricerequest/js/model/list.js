/**
 *
 * Store for grid of prices requests list
 */

new Ext.data.Store({
	storeId: 'pricesrequests',
	fields: [
		{name: 'id', type: 'int'},
		{name: 'sdt', type: 'date', dateFormat: 'c'},
		{name: 'edt', type: 'date', dateFormat: 'c'},
		{name: 'num', type: 'int', defaultValue: 0},
		{name: 'status', type: 'int', defaultValue: 1}
	],
	autoSync: true,
	autoLoad: true,
	sortOnLoad: true,
	sorters: [{property: 'sdt', direction: 'ASC'}],
	proxy: O.proxy.Ajax.get('pricesrequests')
});
