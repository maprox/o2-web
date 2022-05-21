/**
 * Payment type object
 * @class O.model.billing.payment.Type
 * @extends O.model.Object
 */
C.define('O.model.billing.payment.Type', {
	extend: 'O.model.Object'
});

C.define('Billing.payment.Type', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
			{name: 'id', type: 'int'},
			{name: 'name', type: 'string'},
			{name: 'note', type: 'string'},
			{name: 'param', type: 'string'},
			{name: 'visible', type: 'int'}
		]
	}
});
