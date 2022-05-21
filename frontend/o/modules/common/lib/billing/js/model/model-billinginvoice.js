/**
 *
 * Billing invoice record
 */
C.define('modelBillingInvoice', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
			{name: 'id', type: 'int'},
			{name: 'id_account', type: 'int'},
			{name: 'sdt', type: 'date', dateFormat: 'c'},
			{name: 'paydt', type: 'date', dateFormat: 'c'},
			{name: 'status', type: 'int'},
			{name: 'id_payment_type', type: 'int'},
			{name: 'amount', type: 'float'}
		]
	}
});
