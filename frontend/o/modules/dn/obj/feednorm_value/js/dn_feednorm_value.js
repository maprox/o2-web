/**
 * FeednormValue object
 * @class O.model.dn.FeednormValue
 * @extends O.model.Object
 */
C.define('O.model.dn.FeednormValue', {
	extend: 'O.model.Object'
});

C.define('Dn.FeednormValue', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
			{name: 'id', type: 'int'},
			{name: 'id_offer', type: 'int'},
			{name: 'id_warehouse', type: 'int'},
			{name: 'id_region', type: 'int'},
			{name: 'id_product', type: 'int'},
			{name: 'product', type: 'string'},
			{name: 'code', type: 'string'},
			{name: 'warehouse', type: 'string'},
			{name: 'address', type: 'string'},
			{name: 'region', type: 'string'},
			{name: 'amount', type: 'float'}
		]
	}
});
