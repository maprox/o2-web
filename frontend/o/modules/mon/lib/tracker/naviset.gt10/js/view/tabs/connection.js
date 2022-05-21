/**
 * @class O.mon.lib.tracker.naviset.gt10.tab.Connection
 * @extends O.mon.lib.tracker.naviset.tab.Connection
 */

Ext.define('O.mon.lib.tracker.naviset.gt10.tab.Connection', {
	extend: 'O.mon.lib.tracker.naviset.tab.Connection', // common
	alias: 'widget.mon-lib-tracker-naviset.gt10-tab-connection',

/**
	* @constructor
	*/
	initComponent: function() {
		Ext.apply(this, {
			itemId: 'naviset.gt10'
		});
		this.callParent(arguments);
	}
});
