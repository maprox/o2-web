/**
 * @class O.x.model.Package
 * @extends O.model.Object
 */
C.define('O.x.model.Package', {
	extend: 'O.model.Object',
	model: 'X.Package'
});

C.define('X.Package', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
			{name: 'id', type: 'int'},
			{name: 'id_old', type: 'int'},
			{name: 'name', type: 'string'},
			{name: 'fn_package_billing', type: 'string'},
			{name: 'fee'},
			{name: 'modules'},
			{name: 'right_level'},
			{name: 'tariff_option'},
			{name: 'available'},
			{name: 'state', type: 'int'}
		]
	}
});
