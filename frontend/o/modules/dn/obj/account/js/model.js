/**
 *
 * Account object
 * @class O.model.dn.Account
 * @extends O.model.Object
 */
C.define('O.model.dn.Account', {
	extend: 'O.model.Object'
});

C.define('Dn.Account', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
			{name: 'id', type: 'int'},
			{name: 'id_firm', type: 'int'}
		]
	}
});
