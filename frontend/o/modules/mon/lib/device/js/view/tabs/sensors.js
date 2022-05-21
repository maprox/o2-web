/**
 * @class O.mon.lib.device.tab.Connection
 * @extends O.common.lib.modelslist.Tab
 */
Ext.define('O.mon.lib.device.tab.Sensors', {
	extend: 'O.common.lib.modelslist.Tab',
	alias: 'widget.mon-lib-device-tab-sensors',

/**
	* @constructor
	*/
	initComponent: function() {
		this.offCls = 'modelseditor_off';
		this.onCls = 'modelseditor_on';
		this.remCls = 'devicestabsensors_remove';

		this.sensorStore = Ext.create('Ext.data.Store', {
			fields: ['id', 'name'],
			sorters: [{
				property: 'name',
				direction: 'ASC'
			}],
			sortOnLoad: true
		});

		// Conversions window
		this.winConv = Ext.create('O.mon.lib.device.window.Conversions', {
			height: 420,
			width: 700
		});

		Ext.apply(this, {
			title: _('Sensors'),
			itemId: 'sensors',
			layout: 'fit',
			bodyPadding: 0,
			items: [{
				xtype: 'grid',
				border: false,
				store: Ext.create('Ext.data.Store', {
					model: 'Mon.DeviceSensor',
					autoLoad: false,
					sorters: [{
						property: 'name'
					}]
				}),
				viewConfig: {
					// disabled sensors
					getRowClass: function(record) {
						if (record.get('state') == C.cfg.RECORD_IS_TRASHED) {
							return 'is_trashed';
						}
						if (record.get('state') == C.cfg.RECORD_IS_DISABLED) {
							return 'is_disabled';
						}
					}
				},
				columns: [{
					header: _('Name'),
					dataIndex: 'name',
					flex: 2,
					field: {
						allowBlank: false
					}
				}, {
					header: _('Sensor'),
					dataIndex: 'param',
					flex: 1,
					field: {
						xtype: 'combobox',
						displayField: 'name',
						valueField: 'name',
						allowBlank: false,
						editable: false,
						forceSelection: true,
						store: this.sensorStore,
						queryMode: 'local',
						triggerAction: 'all'
					}
				}, {
					header: _('Conversion enabled'),
					dataIndex: 'convert',
					xtype: 'checkcolumn',
					itemId: 'columnConversion',
					editor: {
						xtype: 'checkbox',
						cls: 'x-grid-checkheader-editor'
					}
				}, {
					header: _('Manually'),
					dataIndex: 'manual',
					xtype: 'checkcolumn',
					itemId: 'columnManual',
					editor: {
						xtype: 'checkbox',
						cls: 'x-grid-checkheader-editor'
					}
				}, {
					text: _('Value'),
					dataIndex: 'val',
					flex: 2,
					field: {
						allowBlank: true
					}
				}, {
					text: _('Maximum value'),
					dataIndex: 'val_max',
					flex: 2,
					field: {
						allowBlank: true
					}
				}, {
					text: _('Minimum value'),
					dataIndex: 'val_min',
					flex: 2,
					field: {
						allowBlank: true
					}
				}, {
					text: _('Unit'),
					dataIndex: 'unit',
					flex: 2,
					field: {
						allowBlank: true
					}
				}, {
					text: _('Precision'),
					dataIndex: 'precision',
					flex: 2,
					field: {
						allowBlank: false
					}
				}, {
					text: _('Display'),
					dataIndex: 'display',
					xtype: 'checkcolumn',
					itemId: 'columnDisplay',
					editor: {
						xtype: 'checkbox',
						cls: 'x-grid-checkheader-editor'
					}
				}],
				plugins: [{
					ptype: 'rowediting',
					pluginId: 'editor',
					clicksToEdit: 2
				}]
			}],
			dockedItems: [{
				xtype: 'toolbar',
				dock: 'top',
				enableOverflow: true,
				items: [{
					xtype: 'button',
					itemId: 'btnSensorsAdd',
					text: _('Add'),
					iconCls: 'devicestabsensors_add'
				}, {
					xtype: 'button',
					itemId: 'btnSensorsOnOff',
					text: _('Disable'),
					iconCls: this.offCls,
					disabled: true
				}, {
					xtype: 'button',
					itemId: 'btnSensorsRemove',
					text: _('Remove'),
					iconCls: 'devicestabsensors_remove',
					disabled: true
				}, {
					xtype: 'button',
					itemId: 'btnSensorsConversions',
					text: _('Conversions editor'),
					iconCls: 'devicestabsensors_conversions',
					disabled: true
				}]
			}]
		});
		this.callParent(arguments);
		this.sensorsGrid = this.down('grid');
		this.btnSensorsAdd = this.down('#btnSensorsAdd');
		this.btnSensorsOnOff = this.down('#btnSensorsOnOff');
		this.btnSensorsConversions = this.down('#btnSensorsConversions');
		this.btnSensorsRemove = this.down('#btnSensorsRemove');
	}
});