/**
 * Right object class
 * @class O.x.model.Right
 * @extends O.model.Object
*/

C.define('O.x.model.Right', {
	extend: 'O.model.Object',
	model: 'X.Right'
});

C.define('X.Right', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
			{name: 'id', type: 'int'},
			{name: 'name', type: 'string'},
			{name: 'description', type: 'string'},
			{name: 'alias', type: 'string'},
			{name: 'service', type: 'int'},
			{name: 'type', type: 'int'},
			{name: 'state', type: 'int'}
		]
	}
});
