/**
 * @class O.mon.condition.StateStore
 * @extends Ext.data.Store
 */
C.define('O.mon.condition.StateStore', {
	extend: 'Ext.data.Store',
	model: 'O.mon.condition.StateModel',
	proxy: {
		type: 'memory'
	}
});