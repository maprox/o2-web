/**
 * @class
 * @extends
 */

Ext.define('O.mon.lib.tracker.naviset.tab.Settings', {
	extend: 'O.mon.lib.tracker.common.tab.Settings',
	alias: 'widget.mon-lib-tracker-naviset-tab-settings',

/**
	* @constructor
	*/
	initComponent: function() {
		Ext.apply(this, {
			//itemId: 'naviset'
		});
		this.callParent(arguments);
	}
});
