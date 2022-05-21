/**
 * @class O.app.view.Events
 * @extends C.ui.Panel
 */
Ext.define('O.app.view.Events', {
	extend: 'C.ui.Panel',
	alias: 'widget.act_events',

/** CONFIG */
	config: {
		itemId: 'events',
		layout: 'fit'
	},

/**
	* @construct
	* We initialize items in this method (not in config) via this.setItems,
	* because _([text]) will work only after
	* downloading appropriate user language file.
	*/
	initialize: function() {
		this.setItems([{
			itemId: 'eventspanel',
			xtype: 'eventspanel'
		}, {
			itemId: 'periodchooser',
			xtype: 'periodchooser',
			docked: 'top',
			immediateLoad: true
		}]);
		this.callParent(arguments);
	}

});
