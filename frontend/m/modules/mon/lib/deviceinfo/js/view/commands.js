/**
 * @copyright  2012, Maprox LLC
 */
/**
 * Device information panel
 * @class M.lib.deviceinfo.CommandsPanel
 * @extend C.ui.Panel
 */
Ext.define('M.lib.deviceinfo.CommandsPanel', {
	extend: 'C.ui.Panel',
	alias: 'widget.deviceinfo-commandspanel',

/*  Configuration */
	config: {
		layout: 'fit',
		cls: 'device-commandspanel',
		tpl: null
	},

/**
	* @construct
	*/
	initialize: function() {
		// call parent
		this.callParent(arguments);

		// Templates store
		this.templatesStore = Ext.create('Ext.data.Store', {
			model: 'Mon.Device.Command.Template',
			proxy: Ext.create('Ext.data.proxy.Ajax', {
				api: {
					read: '/mon_device_command_template'
				},
				actionMethods: {
					read: 'GET'
				},
				reader: {
					type: 'json',
					successProperty: 'success',
					rootProperty: 'data',
					totalProperty: 'count'
				},
				extraParams: {
					'$joined': 1,
					'$showtotalcount': 1
				}
			})
		});

		this.templatesView = Ext.create('Ext.DataView', {
			useComponents: true,
			defaultType: 'templatelistitem',
			fullscreen: true,
			store: this.templatesStore,
			emptyText: '<div class="notes-list-empty-text">'
			+ _('No saved commands for device') + '</div>',
			itemTpl: [
				'<div class="template-item"><strong>{name}</strong>',
				'<br> {status} <hr></div>'
			]
		});

		var items = [this.templatesView];

		this.setItems(items);
	}
});
