/**
 * Analytic report object object
 * @class O.dn.model.AnalyticReport
 * @extends O.model.Object
 */
C.define('O.dn.model.AnalyticReport', {
	extend: 'O.model.Object',
	model: 'Dn.AnalyticReport'
});

C.define('Dn.AnalyticReport', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
			{name: 'id', type: 'int'},
			{name: 'id_firm', type: 'int'},
			{name: 'id_type', type: 'int'},
			{name: 'name', type: 'string'},
			{name: 'note', type: 'string'},
			{name: 'config', type: 'string'},
			{name: 'iseditable', type: 'bool', defaultValue: true},
			{name: 'state', type: 'int'}
		]
	}
});
