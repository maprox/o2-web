/**
 * @class O.mon.lib.tracker.autolink.default.tab.Connection
 * @extends O.mon.lib.tracker.autolink.tab.Connection
 */

Ext.define('O.mon.lib.tracker.autolink.default.tab.Connection', {
	extend: 'O.mon.lib.tracker.autolink.tab.Connection', // common
	alias: 'widget.mon-lib-tracker-autolink.default-tab-connection',

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
