/**
 * @class O.dn.model.Division
 * @extends O.model.Object
 */
C.define('O.dn.model.Division', {
	extend: 'O.model.Object',
	model: 'Dn.Division'
});

C.define('Dn.Division', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
			{name: 'id', type: 'int'},
			{name: 'id_firm', type: 'int'},
			{name: 'name', type: 'string'},
			{name: 'state', type: 'int'}
		]
	}
});
