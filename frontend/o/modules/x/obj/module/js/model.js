/**
 * @class O.x.model.Module
 * @extends O.model.Object
 */
C.define('O.x.model.Module', {
	extend: 'O.model.Object',
	model: 'X.Module'
});

C.define('X.Module', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
			{name: 'id', type: 'int'},
			{name: 'id_old', type: 'int'},
			{name: 'id_right', type: 'int'},
			{name: 'enabled', type: 'bool'},
			{name: 'name', type: 'string'},
			{name: 'identifier', type: 'string'},
			{name: 'description', type: 'string'},
			{name: 'actions', type: 'string'},
			{name: 'location', type: 'int'},
			{name: 'state', type: 'int'}
		]
	}
});
