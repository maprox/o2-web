/**
 * @class O.mon.condition.StateModel
 * @extends Ext.data.Model
 */
C.define('O.mon.condition.StateModel', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
			{name: 'name', type: 'string'},
			{name: 'value', type: 'string'}
		]
	}
});