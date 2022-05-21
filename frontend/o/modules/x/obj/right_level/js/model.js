/**
 * Right level object class
 * @class O.x.model.Right_level
 * @extends O.model.Object
*/

C.define('O.x.model.Right_level', {
	extend: 'O.model.Object',
	model: 'X.Right_level'
});

C.define('X.Right_level', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
			{name: 'id', type: 'int'},
			{name: 'name', type: 'string'},
			{name: 'description', type: 'string'},
			{name: 'alias', type: 'string'},
			{name: 'enabled', type: 'bool'},
			{name: 'rights'},
			{name: 'state', type: 'int', defaultValue: 1}
		]
	}
});
