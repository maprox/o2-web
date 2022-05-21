/**
 *
 * Store for grid of billing invoices
 */
C.define('storeBillingInvoice', {
	extend: 'Ext.data.Store',
	model: 'modelBillingInvoice',
	autoLoad: false,
	remoteSort: true,
	proxy: {
		type: 'rest',
		url: '/billing_invoice',
		reader: {
			type: 'json',
			root: 'data',
			totalProperty: 'count'
		},
		writer: {
			type: 'json',
			writeAllFields: true,
			root: 'data'
		}//,
		//extraParams: {
		//	'$filter': 'edt gt now'
		//}
	},
	sortOnLoad: true,
	sorters: [{
		property: 'sdt',
		direction : 'DESC'
	}]
});
