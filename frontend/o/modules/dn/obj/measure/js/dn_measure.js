/**
 *
 * Measure object
 * @class O.model.dn.Measure
 * @extends O.model.Object
 */
C.define('O.model.dn.Measure', {
	extend: 'O.model.Object'
});

C.define('Dn.Measure', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
			{name: 'id', type: 'int'},
			{name: 'id_base', type: 'int'},
			{name: 'name', type: 'string'},
			{name: 'conv', type: 'string'}
		]
	}
});
