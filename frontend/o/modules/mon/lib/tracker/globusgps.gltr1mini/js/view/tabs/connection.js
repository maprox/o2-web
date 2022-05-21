/**
 * @class O.mon.lib.tracker.globusgps.gltr1mini.tab.Connection
 * @extends O.mon.lib.tracker.globusgps.tab.Connection
 */

Ext.define('O.mon.lib.tracker.globusgps.gltr1mini.tab.Connection', {
	extend: 'O.mon.lib.tracker.globusgps.tab.Connection', // globusgps
	alias: 'widget.mon-lib-tracker-globusgps.gltr1mini-tab-connection',

/**
	* @constructor
	*/
	initComponent: function() {
		Ext.apply(this, {
			itemId: 'globusgps.gltr1mini'
		});
		this.callParent(arguments);
	}
});
