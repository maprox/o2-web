/**
 * @class O.x.notification.action.User
 * @extends O.x.notification.action.AbstractList
 */
Ext.define('O.x.notification.action.User', {
	extend: 'O.x.notification.action.AbstractGrid',
	alias: 'widget.x-notification-action-user',

	title: 'Users',
	// n_notification_action_type
	actionType: 4,

	gridAlias: 'x_user',
	gridTitle: 'Users',
	gridNameDataIndex: 'shortname'
});