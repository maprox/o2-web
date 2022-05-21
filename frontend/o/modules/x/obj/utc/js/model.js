/**
 * @class O.x.model.Utc
 * @extends O.model.Object
 */
C.define('O.x.model.Utc', {
	extend: 'O.model.Object',
	model: 'X.Utc'
});

C.define('X.Utc', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
			{name: 'id', type: 'int'},
			{name: 'name', type: 'string'},
			{name: 'val', type: 'string'},
			{name: 'note', type: 'string'},
			{name: 'state', type: 'int'}
		]
	}
});
