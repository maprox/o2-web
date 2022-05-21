/**
 * @class O.mon.lib.tracker.teltonika.gh3000.tab.Connection
 * @extends O.mon.lib.tracker.teltonika.tab.Connection
 */

Ext.define('O.mon.lib.tracker.teltonika.gh3000.tab.Connection', {
	extend: 'O.mon.lib.tracker.teltonika.tab.Connection', // common
	alias: 'widget.mon-lib-tracker-teltonika.gh3000-tab-connection',

/**
	* Flag of visibility of "Configure by SMS" button
	* @type Boolean
	*/
	canBeConfiguredBySms: false,

/**
	* @constructor
	*/
	initComponent: function() {
		Ext.apply(this, {
			itemId: 'teltonika.gh3000'
		});
		this.callParent(arguments);
	}
});
