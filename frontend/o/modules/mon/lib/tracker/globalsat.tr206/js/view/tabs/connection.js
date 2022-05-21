/**
 * @class O.mon.lib.tracker.globalsat.tr206.tab.Connection
 * @extends O.mon.lib.tracker.globalsat.tab.Connection
 */

Ext.define('O.mon.lib.tracker.globalsat.tr206.tab.Connection', {
	extend: 'O.mon.lib.tracker.globalsat.tab.Connection', // globalsat
	alias: 'widget.mon-lib-tracker-globalsat.tr206-tab-connection',

/**
	* @constructor
	*/
	initComponent: function() {
		Ext.apply(this, {
			itemId: 'globalsat.tr206'
		});
		this.callParent(arguments);
	}
});
