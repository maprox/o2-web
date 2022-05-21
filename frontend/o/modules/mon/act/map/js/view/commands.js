/*
 * @class O.mon.act.map.Commands
 */
C.define('O.mon.act.map.Commands', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.mapcommands',
/**
	* @constructs
	* @param {Object} config Объект конфигурации
	*/
	initComponent: function() {

		// Templates store
		this.templatesStore = Ext.create('Ext.data.Store', {
			model: 'Mon.Device.Command.Template',
			storeId: 'monDeviceCommandTemplateStore',
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
					root: 'data',
					totalProperty: 'count'
				},
				extraParams: {
					'$joined': 1,
					'$showtotalcount': 1
				}
			}),
			remoteSort: true,
			sorters: [{
				property: 'name',
				direction: 'DESC'
			}]
		});

		var me = this;
		Ext.apply(this, {
			title: _('Commands'),
			iconCls: 'commands_ico',
			layout: 'fit',
			border: false,
			items: [{
				xtype: 'gridpanel',
				layout: 'fit',
				itemId: 'templatesGrid',
				border: false,
				store: this.templatesStore,
				flex: 1,
				cls: 'wrappedgrid',
				columnLines: false,
				columns: {
					defaults: {
						menuDisabled: true,
						groupable: false,
						sortable: false
					},
					items: [{
						header: _('Name'),
						dataIndex: 'name',
						flex: 1,
						sortable: true
					}, {
						dataIndex: 'nodataindex',
						itemId: 'sendColumn',
						xtype: 'componentcolumn',
						renderer: this.sendRenderer,
						scope: this
					}, {
						header: _('Status'),
						dataIndex: 'status',
						flex: 1
					}]
				}
			}]
		});
		this.callParent(arguments);
		// init variables
		this.grid = this.down('gridpanel');
	}
})
