/**
 *
 * Product object
 * @class O.model.dn.Product
 * @extends O.model.Object
 */
C.define('O.model.dn.Product', {
	extend: 'O.model.Object'
});

C.define('Dn.Product', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
			{name: 'id', type: 'int'},
			{name: 'id_measure', type: 'int'},
			{name: 'name', type: 'string'},
			{name: 'fullname', type: 'string'},
			{name: 'measure', type: 'string'},
			{name: 'price', type: 'float'},
			{name: 'code', type: 'string'},
			{name: 'amount', type: 'float'},
			{name: 'state', type: 'int'}
		]
	}
});
