/**
 * @class O.mon.lib.tracker.teltonika.gh3000.tab.Settings
 * @extends O.mon.lib.tracker.teltonika.tab.Settings
 */

Ext.define('O.mon.lib.tracker.teltonika.gh3000.tab.Settings', {
	extend: 'O.mon.lib.tracker.teltonika.tab.Settings',
	alias: 'widget.mon-lib-tracker-teltonika.gh3000-tab-settings',

/**
	* @constructor
	*/
	initComponent: function() {
		Ext.apply(this, {
			itemId: 'teltonika.gh3000'
		});
		this.callParent(arguments);
	}
});
