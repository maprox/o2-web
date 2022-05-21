/**
 *
 * Offer object
 * @class O.model.dn.Requiredvolume
 * @extends O.model.Object
 */
C.define('O.model.dn.Requiredvolume', {
	extend: 'O.model.Object'
});

C.define('Dn.Requiredvolume', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
			{name: 'id', type: 'int'},
			{name: 'id_firm', type: 'int'},
			{name: 'id_user', type: 'int'},
			{name: 'num', type: 'string'},
			{name: 'sdt', type: 'string'},
			{name: 'edt', type: 'string'},
			{name: 'desctription', type: 'string'},
			{name: 'state', type: 'int'}
		]
	}
});
