/**
 * @class O.x.notification.action.User
 * @extends O.x.notification.action.AbstractList
 */
Ext.define('O.x.notification.action.Groupremove', {
	extend: 'O.x.notification.action.AbstractGrid',
	alias: 'widget.x-notification-action-groupremove',

	title: 'Remove from groups',
	// n_notification_action_type
	actionType: 9,

	gridAlias: 'x_group_mon_device',
	gridTitle: 'Device groups',
	gridNameDataIndex: 'name'

});