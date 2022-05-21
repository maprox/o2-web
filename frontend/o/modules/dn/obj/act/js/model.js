/**
 * @class O.dn.model.Act
 * @extends O.model.Object
 */
C.define('O.dn.model.Act', {
	extend: 'O.model.Object',
	model: 'Dn.Act'
});

C.define('Dn.Act', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
			{name: 'id', type: 'int'},
			{name: 'id_firm', type: 'int'},
			{name: 'dt', type: 'date', dateFormat: 'c'},
			{name: 'num', type: 'string'},
			{name: 'id_firm_executor', type: 'int', useNull: true,
				reference: 'x_firm'},
			{name: 'id_firm_client', type: 'int', useNull: true,
				reference: 'x_firm'},
			{name: 'items', type: 'auto'}
		]
	}
});