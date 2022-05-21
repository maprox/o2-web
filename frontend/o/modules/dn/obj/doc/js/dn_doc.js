/**
 *
 * Doc object
 * @class O.model.dn.Doc
 * @extends O.model.Object
 */
C.define('O.model.dn.Doc', {
	extend: 'O.model.Object'
});

C.define('Dn.Doc', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
			{name: 'id', type: 'int'},
			{name: 'name', type: 'string'},
			{name: 'file', type: 'string'},
			{name: 'hash', type: 'string'},
			{name: 'dt', type: 'string'},
			{name: 'id_firm', type: 'int'},
			{name: 'id_firm_for', type: 'int'}
		]
	}
});
