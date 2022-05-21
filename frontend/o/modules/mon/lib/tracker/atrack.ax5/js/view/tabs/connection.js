/**
 * @class O.mon.lib.tracker.atrack.ax5.tab.Connection
 * @extends O.mon.lib.tracker.atrack.tab.Connection
 */

Ext.define('O.mon.lib.tracker.atrack.ax5.tab.Connection', {
	extend: 'O.mon.lib.tracker.atrack.tab.Connection', // common
	alias: 'widget.mon-lib-tracker-atrack.ax5-tab-connection',

/**
	* @constructor
	*/
	initComponent: function() {
		Ext.apply(this, {
			itemId: 'atrack.ax5'
		});
		this.callParent(arguments);
	}
});
