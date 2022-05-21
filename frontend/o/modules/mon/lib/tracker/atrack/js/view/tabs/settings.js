/**
 * @class O.mon.lib.tracker.atrack.tab.Settings
 * @extends O.mon.lib.tracker.common.tab.Settings
 */

Ext.define('O.mon.lib.tracker.atrack.tab.Settings', {
	extend: 'O.mon.lib.tracker.common.tab.Settings',
	alias: 'widget.mon-lib-tracker-atrack-tab-settings',

/**
	* @constructor
	*/
	initComponent: function() {
		Ext.apply(this, {
			//itemId: 'atrack'
		});
		this.callParent(arguments);
	}
});
