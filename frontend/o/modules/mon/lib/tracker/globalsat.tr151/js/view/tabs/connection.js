/**
 * @class O.mon.lib.tracker.globalsat.tr151.tab.Connection
 * @extends O.mon.lib.tracker.globalsat.tab.Connection
 */

Ext.define('O.mon.lib.tracker.globalsat.tr151.tab.Connection', {
	extend: 'O.mon.lib.tracker.globalsat.tab.Connection', // globalsat
	alias: 'widget.mon-lib-tracker-globalsat.tr151-tab-connection',

/**
	* @constructor
	*/
	initComponent: function() {
		Ext.apply(this, {
			itemId: 'globalsat.tr151'
		});
		this.callParent(arguments);
	}
});
