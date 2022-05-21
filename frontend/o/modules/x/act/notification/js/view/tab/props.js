/**
 * @class O.x.act.notification.tab.Props
 * @extends O.common.lib.modelslist.Tab
 */
C.define('O.x.act.notification.tab.Props', {
	extend: 'O.common.lib.modelslist.Tab',
	alias: 'widget.x-notification-tab-props',

/**
	* @constructor
	*/
	initComponent: function() {
		var padding = 20; // default field padding
		Ext.apply(this, {
			title: _('Properties'),
			iconCls: 'properties',
			itemId: 'properties',
			bodyPadding: padding,
			autoScroll: true,
			layout: 'anchor',
			items: [{
				border: false,
				height: 220 + (2 * padding),
				anchor: '100%',
				layout: {
					type: 'hbox',
					align: 'stretch'
				},
				defaults: {
					border: false
				},
				items: [{
					layout: 'anchor',
					defaults: {
						labelAlign: 'top',
						anchor: '100%'
					},
					flex: 1,
					items: [{
						xtype: 'textfield',
						name: 'name',
						fieldLabel: _('Name')
					}, {
						xtype: 'combo',
						name: 'id_type',
						fieldLabel: _('Notification type'),
						queryMode: 'local',
						editable: false,
						displayField: 'name',
						valueField: 'id',
						value: 1,
						store: 'store-x_notification_type'
					}, {
						xtype: 'combo',
						name: 'id_importance',
						fieldLabel: _('Importance'),
						queryMode: 'local',
						editable: false,
						displayField: 'name',
						valueField: 'id',
						value: 1,
						store: 'store-x_notification_importance'
					}, {
						xtype: 'textarea',
						name: 'note',
						fieldLabel: _('Note'),
						height: 100
					}]
				}]
			}]
		});
		this.callParent(arguments);
	}
});
