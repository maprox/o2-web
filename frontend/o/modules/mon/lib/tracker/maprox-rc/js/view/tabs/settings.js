/**
 * @class O.mon.lib.tracker.maprox-rc.tab.Settings
 * @extends O.mon.lib.tracker.common.tab.Settings
 */

Ext.define('O.mon.lib.tracker.maprox-rc.tab.Settings', {
	extend: 'O.mon.lib.tracker.common.tab.Settings',
	alias: 'widget.mon-lib-tracker-maprox-rc-tab-settings',

/**
	* @constructor
	*/
	initComponent: function() {
		Ext.apply(this, {
			itemId: 'maprox-rc'
		});
		this.callParent(arguments);
	}
});
