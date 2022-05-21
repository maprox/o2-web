/**
 * @class O.mon.lib.tracker.globalsat.tr203.tab.Connection
 * @extends O.mon.lib.tracker.globalsat.tab.Connection
 */

Ext.define('O.mon.lib.tracker.globalsat.tr203.tab.Connection', {
	extend: 'O.mon.lib.tracker.globalsat.tab.Connection', // globalsat
	alias: 'widget.mon-lib-tracker-globalsat.tr203-tab-connection',

/**
	* @constructor
	*/
	initComponent: function() {
		Ext.apply(this, {
			itemId: 'globalsat.tr203'
		});
		this.callParent(arguments);
	}
});
