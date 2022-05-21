/**
 * @class O.mon.lib.device.tab.Commands
 * @extends O.common.lib.modelslist.Tab
 */
Ext.define('O.mon.lib.device.tab.Commands', {
	extend: 'O.common.lib.modelslist.Tab',
	alias: 'widget.mon-lib-device-tab-commands',

/**
	* @constructor
	*/
	initComponent: function() {
		var me = this;

		// Command type store
		this.commandTypeStore = C.getStore('mon_device_command_type', {
			sorters: [{
				property: 'displayname',
				direction: 'ASC'
			}]
		});

		// Commands store
		this.commandsStore = Ext.create('Ext.data.Store', {
			model: 'Mon.Device.Command',
			storeId: 'monDeviceCommandStore',
			proxy: Ext.create('Ext.data.proxy.Ajax', {
				api: {
					read: '/mon_device_command'
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
				property: 'dt',
				direction: 'DESC'
			}]
		});

		// Command template store
		this.commandTemplateStore = Ext.create('Ext.data.Store', {
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

		// Editor plugin
		this.templateEditor = Ext.create('Ext.grid.plugin.RowEditing', {
			parent: this,
			clicksToEdit: 2
		});

		// Tpl for command type combobox item
		var commandTypeTpl =  Ext.create('Ext.XTemplate',
			'<tpl for=".">',
				'<div class="x-boundlist-item">',
				'<div class="command-type-item-text">{displayname}</div>',
				'{[this.getIcons(values)]}',
				'<div style="clear:both"></div>',
				'</div>',
			'</tpl>',
			{
				getIcons: function(values) {
					var icons = ''
					var transports = values.transports;
					for (var i = 0; i < transports.length; i++) {
						icons += '<i class="transport-icon '
						+ ' transport-' + transports[i].name + '"></i>'
					}
					return icons
				}
			}
		);

		var padding = 10;
		Ext.apply(this, {
			title: _('Commands'),
			itemId: 'commands',
			bodyPadding: 0,
			defaults: {
				border: false
			},
			/*layout: {
				type: 'vbox',
				align: 'stretch'
			},*/
			layout: 'border',
			autoScroll: true,
			items: [{
				// Command send panel
				region: 'north',
				split: true,
				collapsible: true,
				collapsed: true,
				collapseMode: 'mini',
				collapseDirection: 'top',
				preventHeader: true,
				hideCollapseTool: true,
				xtype: 'panel',
				autoScroll: true,
				//anchor: '100%',
				//flex: 1,
				itemId: 'panelCommandSend',
				bodyPadding: padding,
				layout: 'anchor',
				defaults: {
					labelAlign: 'top',
					border: false
				},
				items: [{
					// Panel with command and transport select
					xtype: 'panel',
					layout: {
						type: 'hbox',
						pack: 'start',
						align: 'stretch'
					},
					defaults: {
						labelAlign: 'top'
					},
					items: [{
						fieldLabel: _('Command'),
						xtype: 'combobox',
						name: 'command_type',
						itemId: 'commandType',
						width: 600,
						store: this.commandTypeStore,
						editable: false,
						queryMode: 'local',
						displayField: 'displayname',
						valueField: 'id',
						forceSelection: true,
						tpl: commandTypeTpl
					}, {
						xtype: 'tbfill'
					}, {
						// Transport radios
						xtype: 'fieldcontainer',
						flex: 1,
						fieldLabel: _('Transport'),
						defaultType: 'radiofield',
						layout: {
							type: 'hbox',
							pack: 'start',
							align: 'stretch'
						},
						defaults: {
							margins: '0 10 0 0'
						},
						items: [{
							boxLabel: _('Auto'),
							name: 'transport',
							inputValue: null,
							id: 'radio-auto',
							checked: true
						}, {
							boxLabel: _('TCP'),
							name: 'transport',
							inputValue: 'tcp',
							id: 'radio-tcp'
						}, {
							boxLabel: _('SMS'),
							name: 'transport',
							inputValue: 'sms',
							id: 'radio-sms'
						}]
					}]
				}, {
					xtype: 'tbspacer',
					height: padding
				},{
					// Params form dynamically populated
					xtype: 'form',
					border: true,
					itemId: 'paramsForm',
					bodyPadding: padding,
					title: _('Command params'),
					defaults: {
						width: 400,
						labelAlign: 'top'
					}
				}, {
					xtype: 'tbspacer',
					height: padding
				}, {
					xtype: 'gridpanel',
					hidden: true,
					title: _('Saved commands'),
					itemId: 'templatesGrid',
					store: this.commandTemplateStore,
					plugins: [
						this.templateEditor
					],
					flex: 1,
					cls: 'wrappedgrid',
					columnLines: false,
					columns: [{
						header: _('Name'),
						dataIndex: 'name',
						flex: 1,
						editor: {
							allowBlank: false
						}
					}, {
						xtype: 'actioncolumn',
						itemId: 'deleteTemplateColumn',
						width: 30,
						sortable: false,
						menuDisabled: true,
						items: [{
							iconCls: 'column-delete',
							tooltip: _('Delete')
						}]
					}]
				}, {
					xtype: 'tbspacer',
					height: padding
				}, {
					xtype: 'toolbar',
					dock: 'bottom',
					ui: 'footer',
					items: [{
						xtype: 'button',
						itemId: 'btnSendCommand',
						text: _('Send command'),
						formBind: true
					}, {
						xtype: 'button',
						itemId: 'btnSaveTemplate',
						text: _('Save'),
						hidden: true
						//,
						//formBind: true
					}, {
						xtype: 'button',
						itemId: 'btnCreateTemplate',
						text: _('Save as template'),
						formBind: true
					}, {
						xtype: 'tbfill'
					}, {
						xtype: 'button',
						itemId: 'btnCancel',
						text: _('Cancel')
					}]
				}]
			}, {
				region: 'center',
				xtype: 'gridpanel',
				//itemId: 'packetsgrid',
				anchor: '100%',
				store: this.commandsStore,
				//flex: 1,
				cls: 'wrappedgrid',
				columnLines: false,
				columns: [{
					header: _('Time'),
					dataIndex: 'dt',
					width: 150,
					fixed: true,
					format: O.format.Timestamp,
					xtype: 'datecolumn'
				}, {
					header: _('Transport'),
					dataIndex: 'transport_name',
					width: 150,
					fixed: true,
					sortable: false
				}, {
					header: _('Command'),
					dataIndex: 'command_description',
					flex: 1,
					sortable: false
				}, {
					header: _('Command content'),
					dataIndex: 'command_content',
					flex: 1,
					sortable: false,
					renderer: function(value) {
						return C.utils.replaceURLWithHTMLLinks(value);
					}
				}, {
					header: _('Status'),
					dataIndex: 'status',
					flex: 1,
					renderer: function(value) {
						if (value === C.cfg.STATUS_SENT) {
							return '<span class="command-sent">'
								+ _('Sent')
								+ '</span>';
						}

						if (value === C.cfg.STATUS_DELIVERED) {
							return '<span class="command-delivered">'
								+ _('Delivered')
								+ '</span>';
						}

						if (value === C.cfg.STATUS_ERROR) {
							return '<span class="command-error">'
								+ _('Error')
								+ '</span>';
						}

						return '';
					}
				}, {
					header: _('Answer'),
					dataIndex: 'answer',
					flex: 1,
					renderer: function(value) {
						return _(value);
					}
				}],
				trackMouseOver: false,
				enableColumnResize: true,
				dockedItems: [{
					xtype: 'pagingtoolbar',
					store: this.commandsStore,
					dock: 'bottom',
					displayInfo: true
				}]
			}],
			dockedItems: [{
				xtype: 'toolbar',
				dock: 'top',
				enableOverflow: true,
				items: [{
					xtype: 'button',
					itemId: 'btnCreateCmd',
					text: _('Create command'),
					iconCls: 'create_cmd_btn',
					width: 'auto'
				}]
			}]
		});

		this.callParent(arguments);
		this.btnCreateCmd = this.down('#btnCreateCmd');
		this.panelCommandSend = this.down('#panelCommandSend');
		this.comboCommandType = this.down('#commandType');
		this.paramsForm =  this.down('#paramsForm');
		this.btnSendCommand = this.down('#btnSendCommand');
		this.btnCancel = this.down('#btnCancel');
		this.radioAuto = this.down('#radio-auto');
		this.radioTcp = this.down('#radio-tcp');
		this.radioSms = this.down('#radio-sms');


		this.templatesGrid = this.down('#templatesGrid');

		this.deleteTemplateColumn = this.down('#deleteTemplateColumn');

		this.btnCreateTemplate = this.down('#btnCreateTemplate');
		this.btnSaveTemplate = this.down('#btnSaveTemplate');
	}
});
