/**
 * @class O.mon.lib.tracker.teltonika.fmxxxx.tab.Connection
 * @extends O.mon.lib.tracker.teltonika.tab.Connection
 */

Ext.define('O.mon.lib.tracker.teltonika.fmxxxx.tab.Connection', {
	extend: 'O.mon.lib.tracker.teltonika.tab.Connection', // common
	alias: 'widget.mon-lib-tracker-teltonika.fmxxxx-tab-connection',

/**
	* Flag of visibility of "Configure by SMS" button
	* @type Boolean
	*/
	canBeConfiguredBySms: true,

/**
	* @constructor
	*/
	initComponent: function() {
		Ext.apply(this, {
			itemId: 'teltonika.fmxxxx'
		});
		this.callParent(arguments);
	}
});
