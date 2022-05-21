/**
 * @class O.data.common.lib.ListAction
 * @extends Ext.data.Model
 */
C.define('O.data.common.lib.ListAction', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
			{name: 'name', type: 'string'},
			{name: 'state', type: 'int', defaultValue: 1}
		]
	}
});