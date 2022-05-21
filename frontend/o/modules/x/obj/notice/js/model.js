/**
 * @class O.x.model.Notice
 * @extends O.model.Object
 */
C.define('O.x.model.Notice', {
	extend: 'O.model.Object',
	model: 'X.Notice'
});

C.define('X.Notice', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
			{name: 'id', type: 'int'},
			{name: 'name', type: 'string'},
			{name: 'alias', type: 'string'},
			{name: 'id_importance', type: 'int', useNull: true},
			{name: 'alias_importance', type: 'string'}
		]
	}
});
