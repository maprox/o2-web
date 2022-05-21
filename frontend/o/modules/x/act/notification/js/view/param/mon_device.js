/**
 * @class O.x.notification.param.MonDevice
 * @extends O.x.notification.param.Abstract
 */
Ext.define('O.x.notification.param.MonDevice', {
	extend: 'O.x.notification.param.AbstractGroupslist',
	alias: 'widget.x-notification-param-mon_device',

	listType: 'listgroupsdevices',
	tableAlias: 'mon_device'
});