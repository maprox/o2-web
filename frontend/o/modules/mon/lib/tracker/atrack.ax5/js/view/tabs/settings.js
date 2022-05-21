/**
 * @class O.mon.lib.tracker.atrack.ax5.tab.Settings
 * @extends O.mon.lib.tracker.atrack.tab.Settings
 */

Ext.define('O.mon.lib.tracker.atrack.ax5.tab.Settings', {
	extend: 'O.mon.lib.tracker.atrack.tab.Settings',
	alias: 'widget.mon-lib-tracker-atrack.ax5-tab-settings',

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
