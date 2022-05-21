/**
 *
 * Offer object
 * @class O.model.dn.Offer
 * @extends O.model.Object
 */
C.define('O.model.dn.Offer', {
	extend: 'O.model.Object'
});

C.define('Dn.Offer', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
			{name: 'id', type: 'int'},
			{name: 'id_firm', type: 'int'},
			{name: 'firm', type: 'object'},
			{name: 'firm_name', type: 'string',
				convert: function(value, record) {
					var firm_client = record.get('firm');
					return (firm_client[0] && firm_client[0].company) ?
						firm_client[0].company.name : '';
				}
			},
			{name: 'id_user', type: 'int'},
			{name: 'num', type: 'string'},
			{name: 'sdt', type: 'string'},
			{name: 'edt', type: 'string'},
			{name: 'desctription', type: 'string'},
			{name: 'state', type: 'int'}
		]
	}
});
