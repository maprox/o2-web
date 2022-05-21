/**
 * Objects group model
 * @class O.lib.grouplist.model.Group
 * @extends Ext.data.Model
 */
C.define('O.lib.grouplist.model.Group', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
			{name: 'id', type: 'int'},
			{name: 'name', type: 'string'},
			{name: 'type', type: 'string', defaultValue: 'static'},
			{name: 'hideWhenEmpty', type: 'boolean', defaultValue: false},
			{name: 'itemsCount', type: 'int', defaultValue: 0},
			{name: 'items', type: 'auto'},
			{name: 'weight', type: 'int', defaultValue: 0}
		]
	},
	hasMany: 'O.lib.grouplist.model.Object'
});
