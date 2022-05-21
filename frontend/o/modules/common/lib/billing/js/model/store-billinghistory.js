/**
 * Store for grid of billing history
 */
C.define('storeBillingHistory', {
	extend: 'Ext.data.Store',
	model: 'modelBillingHistory',
	autoLoad: false,
	remoteFilter: true,
	remoteSort: true,
	sorters: [{
		property: 'dt',
		direction: 'DESC'
	}],
	proxy: {
		type: 'ajax',
		url: '/billing_history',
		reader: {
			type: 'json',
			root: 'data',
			totalProperty: 'count'
		}
	}
});