/**
 * Payment request line model
 */
C.define('Product', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
			{name: 'id', type: 'int'},
			{name: 'name', type: 'string'},
			{name: 'fullname', type: 'string'},
			{name: 'id_measure', type: 'int'},
			{name: 'measure', type: 'string'},
			{name: 'code', type: 'string'},
			{name: 'ntd', type: 'string'},
			{name: 'shipmenttime', type: 'string'},
			{name: 'shelflife', type: 'string'},
			{name: 'used', type: 'boolean'},
			{name: 'state', type: 'int'}
		]
	}
});
