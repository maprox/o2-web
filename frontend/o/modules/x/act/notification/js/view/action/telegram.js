/**
 * @class O.x.notification.action.Telegram
 * @extends O.x.notification.action.AbstractList
 */
Ext.define('O.x.notification.action.Telegram', {
	extend: 'O.x.notification.action.AbstractList',
	alias: 'widget.x-notification-action-telegram',

/**
	* @constructor
	*/
	initComponent: function() {
		Ext.apply(this, {
			title: _('Notify by telegram'),
			vtype: 'number',
			actionType: 12 // telegram action type
		});
		this.callParent(arguments);
	}
});