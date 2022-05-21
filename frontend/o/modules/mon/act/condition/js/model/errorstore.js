/**
 * @class O.mon.condition.ErrorStore
 * @extends Ext.data.Store
 */
C.define('O.mon.condition.ErrorStore', {
	extend: 'Ext.data.Store',
	model: 'O.mon.condition.ErrorModel',
	proxy: {
		type: 'memory'
	}
});