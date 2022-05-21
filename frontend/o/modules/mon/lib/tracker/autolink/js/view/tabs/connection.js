/**
 * @class O.mon.lib.tracker.autolink.tab.Connection
 * @extends O.mon.lib.tracker.common.tab.Connection
 */

Ext.define('O.mon.lib.tracker.autolink.tab.Connection', {
	extend: 'O.mon.lib.tracker.common.tab.Connection', // common
	alias: 'widget.mon-lib-tracker-autolink-tab-connection',

/**
	* Flag of visibility of "Configure by SMS" button
	* @type Boolean
	*/
	canBeConfiguredBySms: true
});
