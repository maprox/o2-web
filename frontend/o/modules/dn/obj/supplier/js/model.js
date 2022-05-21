/**
 * Supplier object
 * @class O.dn.model.Supplier
 * @extends O.model.Object
 */
C.define('O.dn.model.Supplier', {
	extend: 'O.model.Object',
	model: 'Dn.Supplier'
});

C.define('Dn.Supplier', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
			{name: 'id', type: 'int'},
			{name: 'dt_request', type: 'date', dateFormat: 'c'},
			{name: 'id_firm', type: 'int'},
			{name: 'id_firm_client', type: 'int'},
			{name: 'state', type: 'int'},
			{name: 'has_docs', type: 'bool'},
			{name: 'firm_client'},
			{name: 'name',
				convert: function(value, record) {
					var firm_client = record.get('firm_client');
					return (firm_client && firm_client.company) ?
						firm_client.company.name : '';
				}},
			{name: 'statusname',
				convert: function(value, record) {
					var status = record.get('state');
					var statusMsg = {
						0: _('Waiting for approval'),
						1: _('Working'),
						2: _('Disabled'),
						3: _('Deleted')
					};
					return statusMsg[status] || '';
				}}
		]
	}
});
