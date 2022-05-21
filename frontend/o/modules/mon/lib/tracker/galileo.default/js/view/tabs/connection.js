/**
 * @class O.mon.lib.tracker.galileo.default.tab.Connection
 * @extends O.mon.lib.tracker.galileo.tab.Connection
 */

Ext.define('O.mon.lib.tracker.galileo.default.tab.Connection', {
	extend: 'O.mon.lib.tracker.galileo.tab.Connection', // common
	alias: 'widget.mon-lib-tracker-galileo.default-tab-connection',

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
