/**
 * @class
 * @extends
 */

Ext.define('O.mon.lib.tracker.googlelatitude.tab.Connection', {
	extend: 'O.mon.lib.tracker.abstract.tab.Connection', // abstract
	alias: 'widget.mon-lib-tracker-googlelatitude-tab-connection',

/**
	* @constructor
	*/
	initComponent: function() {
		Ext.apply(this, {
			itemId: 'googlelatitude',
			items: [{
				xtype: 'button',
				itemId: 'btnAddAccount',
				text: _('Add google account')
			}]
		});

		this.callParent(arguments);
	}
});
