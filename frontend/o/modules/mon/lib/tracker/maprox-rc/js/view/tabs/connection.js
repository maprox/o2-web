/**
 * @class
 * @extends
 */

Ext.define('O.mon.lib.tracker.maprox-rc.tab.Connection', {
	extend: 'O.mon.lib.tracker.common.tab.Connection', // common
	alias: 'widget.mon-lib-tracker-maprox-rc-tab-connection',

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
