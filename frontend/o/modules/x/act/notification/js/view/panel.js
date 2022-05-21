/**
 * Notifications list
 * @class O.x.act.notification.Panel
 * @extends O.common.lib.modelslist.Panel
 */
C.define('O.x.act.notification.Panel', {
	extend: 'O.common.lib.modelslist.Panel',
	alias: 'widget.x-notification',

	model: 'X.Notification',
	managerAlias: 'x_notification',
	tabsAliases: [
		'x-notification-tab-props',
		'x-notification-tab-params',
		'x-notification-tab-actions',
		'schedule'
	],
	tabsConfig: {
		xtype: 'x-notification-tabs'
	},
	idFirm: null,

/**
	* @constructor
	*/
	initComponent: function() {
		var typeStore = Ext.getStore('store-x_notification_type');
		this.listConfig = {
			hideHeaders: false,
			columns: {
				defaults: {
					menuDisabled: true,
					flex: 1
				}, items: [{
					header: _('Name'),
					dataIndex: 'name',
					editor: {
						allowBlank: false
					}
				}, {
					header: _('Notification type'),
					dataIndex: 'id_type',
					renderer: function(value) {
						var record = typeStore.getById(value);
						return record ? record.get('name') : '';
					},
					editor: {
						xtype: 'combobox',
						store: typeStore,
						displayField: 'name',
						valueField: 'id',
						queryMode: 'local',
						editable: false
					}
				}]
			}
		};
		this.callParent(arguments);
	}
});