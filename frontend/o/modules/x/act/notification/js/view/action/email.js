/**
 * @class O.x.notification.action.Email
 * @extends O.x.notification.action.AbstractList
 */
Ext.define('O.x.notification.action.Email', {
	extend: 'O.x.notification.action.AbstractList',
	alias: 'widget.x-notification-action-email',

/**
	* @constructor
	*/
	initComponent: function() {
		Ext.apply(this, {
			title: _('Notify by an email'),
			vtype: 'email',
			actionType: 2 // email action type
		});
		this.callParent(arguments);
	}
});