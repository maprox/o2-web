/**
 * @class
 * @extends
 */

Ext.define('O.mon.lib.tracker.googlelatitude.tab.Settings', {
	extend: 'O.mon.lib.tracker.abstract.tab.Settings',
	alias: 'widget.mon-lib-tracker-googlelatitude-tab-settings',

/**
	* @constructor
	*/
	initComponent: function() {
		Ext.apply(this, {
			itemId: 'googlelatitude'
		});

		this.callParent(arguments);
	}
});
