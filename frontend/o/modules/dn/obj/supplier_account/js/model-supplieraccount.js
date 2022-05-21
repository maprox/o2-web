/**
 *
 *
 */
C.define('modelSupplierAccount', {
	extend: 'Ext.data.Model',

/** Language specific */
	lngStatusWaitingForApproval: 'Waiting for approval',
	lngStatusWorking: 'Working',
	lngStatusTrashed: 'Trashed',

/** Fields */
	config: {
		fields: [
			{name: 'dt_request', type: 'date', dateFormat: 'c'},
			{name: 'id_firm', type: 'int'},
			{name: 'id_firm_client', type: 'int'},
			{name: 'state', type: 'int'},
			{name: 'has_docs', type: 'bool'},
			{name: 'firm_client'},
			{name: 'firmname',
				convert: function(value, record) {
					var firm_client = record.get('firm_client');
					return (firm_client && firm_client.company) ?
						firm_client.company.name : '';
				}},
			{name: 'statusname',
				convert: function(value, record) {
					var status = record.get('state');
					var msg = '';
					switch (status) {
						case 0: msg = record.lngStatusWaitingForApproval; break;
						case 1: msg = record.lngStatusWorking; break;
						case 2: msg = _('Disabled'); break;
						case 3: msg = record.lngStatusTrashed; break;
					}
					return msg;
				}}
		]
	},
	proxy: O.proxy.Ajax.get('dn_supplier', '', {
		extraParams: {
			loadDeleted: true
		}
	})
});
