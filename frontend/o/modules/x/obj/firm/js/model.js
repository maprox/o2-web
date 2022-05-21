/**
 * Firm object
 * @class O.x.model.Firm
 * @extends O.model.Object
 */
C.define('O.x.model.Firm', {
	extend: 'O.model.Object',
	model: 'X.Firm'
});

C.define('X.Firm', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
			{name: 'id', type: 'int'},
			{name: 'individual', type: 'int'},
			{name: 'iseditable', type: 'string'},
			{name: 'id_company', type: 'int'},
			{name: 'id_lang', type: 'int'},
			{name: 'id_utc', type: 'int'},
			{name: 'welcome', type: 'string'},
			{name: 'billing_disabled', type: 'int'},
			{name: 'disable_reason', type: 'string'},
			{name: 'event_period_length', type: 'int'},
			{name: 'have_unpaid_account', type: 'int'},
			{name: 'product_group', type: 'int'},
			{name: 'state', type: 'int'},
			{name: 'company', type: 'object'},
			{name: 'contract', type: 'object'},
			{name: 'id_manager', type: 'int', useNull: true},
			{name: 'firmname', persist: false,
				convert: function(v, rec) {
					return rec.get('company.name');
				}
			}
		]
	}
});

