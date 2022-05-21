/**
 * Msg panel
 * @class O.app.view.Msg
 * @extends C.ui.Panel
 */
Ext.define('O.app.view.Msg', {
	extend: 'C.ui.Panel',
	alias: 'widget.act_msg',

/** CONFIG */
	config: {
		itemId: 'msg',
		layout: 'fit'
	},

/**
	* @construct
	* We initialize items in this method (not in config) via this.setItems,
	* because _([text]) will work only after
	* downloading appropriate user language file.
	*/
	initialize: function() {
		this.callParent(arguments);
		this.setItems([{
			itemId: 'msgpanel',
			xtype: 'msgpanel'
		}, {
			xtype: 'toolbar',
			docked: 'top',
			title: _('System messages')
		}]);
	}

});