/**
 * @class O.mon.lib.tracker.autolink.default.tab.Settings
 * @extends O.mon.lib.tracker.autolink.tab.Settings
 */

Ext.define('O.mon.lib.tracker.autolink.default.tab.Settings', {
	extend: 'O.mon.lib.tracker.autolink.tab.Settings',
	alias: 'widget.mon-lib-tracker-autolink.default-tab-settings',

/**
	* @constructor
	*/
	initComponent: function() {
		Ext.apply(this, {
			itemId: 'autolink.default'
		});
		this.callParent(arguments);
	}
});
