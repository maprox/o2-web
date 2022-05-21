/**
 * @class O.mon.lib.tracker.teltonika.fmxxxx.tab.Settings
 * @extends O.mon.lib.tracker.teltonika.tab.Settings
 */

Ext.define('O.mon.lib.tracker.teltonika.fmxxxx.tab.Settings', {
	extend: 'O.mon.lib.tracker.teltonika.tab.Settings',
	alias: 'widget.mon-lib-tracker-teltonika.fmxxxx-tab-settings',

/**
	* @constructor
	*/
	initComponent: function() {
		Ext.apply(this, {
			itemId: 'teltonika.fmxxxx'
		});
		this.callParent(arguments);
	}
});
