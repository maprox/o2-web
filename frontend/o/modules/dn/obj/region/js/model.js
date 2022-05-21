/**
 * Region object
 * @class O.model.dn.Region
 * @extends O.model.Object
 */
C.define('O.model.dn.Region', {
	extend: 'O.model.Object'
});

C.define('Dn.Region', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
			{name: 'id', type: 'int'},
			{name: 'name', type: 'string'},
			{name: 'important', type: 'bool', defaultValue: false}
		]
	}
});
