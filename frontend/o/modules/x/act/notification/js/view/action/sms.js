/**
 * @class O.x.notification.action.Sms
 * @extends O.x.notification.action.AbstractList
 */
Ext.define('O.x.notification.action.Sms', {
	extend: 'O.x.notification.action.AbstractList',
	alias: 'widget.x-notification-action-sms',

/**
	* @constructor
	*/
	initComponent: function() {
		Ext.apply(this, {
			title: _('Notify by sms'),
			vtype: 'phone',
			actionType: 3 // sms action type
		});
		this.callParent(arguments);
	}
});