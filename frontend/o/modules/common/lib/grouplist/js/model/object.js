/**
 * Object model
 * @class O.lib.grouplist.model.Object
 * @extends Ext.data.Model
 */
C.define('O.lib.grouplist.model.Object', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
			{name: 'id', type: 'int'},
			{name: 'name', type: 'string'},
			{name: 'enabled', type: 'boolean'},
			{name: 'disabled', type: 'boolean'}
		]
	}
});
