/**
 * Billing history record
 */
C.define('modelBillingHistory', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
			{name: 'id', type: 'int'},
			{name: 'id_account', type: 'int'},
			{name: 'id_invoice', type: 'int'},
			{name: 'dt', type: 'date', dateFormat: 'c'},
			{name: 'debitdt', type: 'date', dateFormat: 'c'},
			{name: 'operation',
				convert: function(value, record) {
					var sum = record.get('sum');

					if (sum < 0) {
						return _('debit');
					} else if (sum > 0) {
						return _('refill');
					} else {
						return _('action');
					}
				}},
			{name: 'vat',
				convert: function(value, record) {
					return 0;
				}},
			{name: 'balance', type: 'float'},
			{name: 'sum', type: 'float'},
			{name: 'note',
				convert: function(value, record) {
					var invoice = record.get('id_invoice');
					value = _(value);

					if (invoice) {
						value = value + _('invoiceNum') + invoice;
					}

					return value;
				}},
			{name: 'details', type: 'auto'}
		]
	}
});
