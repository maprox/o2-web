/**
 * @class O.mon.lib.tracker.naviset.gt20.tab.Settings
 * @extends O.mon.lib.tracker.naviset.tab.Settings
 */

Ext.define('O.mon.lib.tracker.naviset.gt20.tab.Settings', {
	extend: 'O.mon.lib.tracker.naviset.tab.Settings',
	alias: 'widget.mon-lib-tracker-naviset.gt20-tab-settings',

/**
	* @constructor
	*/
	initComponent: function() {
		Ext.apply(this, {
			itemId: 'naviset.gt20'
		});
		this.callParent(arguments);
	}
});
