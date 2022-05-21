/**
 * @class O.mon.lib.tracker.galileo.default.tab.Settings
 * @extends O.mon.lib.tracker.galileo.tab.Settings
 */

Ext.define('O.mon.lib.tracker.galileo.default.tab.Settings', {
	extend: 'O.mon.lib.tracker.galileo.tab.Settings',
	alias: 'widget.mon-lib-tracker-galileo.default-tab-settings',

/**
	* @constructor
	*/
	initComponent: function() {
		Ext.apply(this, {
			itemId: 'galileo.default'
		});
		this.callParent(arguments);
	}
});
