/**
 *
 */
C.define('O.mon.lib.device.window.Conversions', {
	extend: 'Ext.window.Window',
	//alias: 'widget.deviceswindowconversions',
	//alias: 'widget.mon-device-window-sensors',

	conversionUrl: 'mon_device_sensor_conversion',

/**
	* @constructor
	*/
	initComponent: function() {
		// init store
		this.pointsStore = Ext.create('Ext.data.Store', {
			fields: [
				{name: 'x', type: 'float'},
				{name: 'y', type: 'float'}
			],
			data: [],
			sorters: [{
				property: 'x'
			}]
		});
		// init component
		Ext.apply(this, {
			title: _('Conversions editor'),
			closeAction: 'hide',
			modal: true,
			border: false,
			layout: 'border',
			defaults: {
				border: false
			},
			items: [{
				region: 'center',
				itemId: 'graph',
				html: '',
				dockedItems: [{
					xtype: 'toolbar',
					dock: 'top',
					enableOverflow: true,
					items: [{
						itemId: 'btnChangeSmoothing',
						text: _('Smoothing'),
						iconCls: 'deviceswindowconversion_smoothing',
						enableToggle: true
					}, {
						xtype: 'tbspacer'
					}, _('Value checking') + ':', {
						xtype: 'tbspacer'
					}, {
						xtype: 'numberfield',
						name: 'x',
						width: 60
					}, {
						xtype: 'tbspacer'
					}, {
						xtype: 'button',
						itemId: 'btnCheckValue',
						text: _('Check value'),
						iconCls: 'deviceswindowconversion_check'
					}, {
						xtype: 'textfield',
						readOnly: true,
						width: 60,
						name: 'y'
					}]
				}]
			}, {
				itemId: 'pointsGrid',
				xtype: 'gridpanel',
				split: true,
				region: 'east',
				store: this.pointsStore,
				multiSelect: true,
				width: 210,
				columns: {
					defaults: {
						menuDisabled: true,
						flex: 1,
						field: {
							xtype: 'numberfield',
							allowBlank: false
						}
					},
					items: [{
						header: _('x'),
						dataIndex: 'x'
					}, {
						header: _('y'),
						dataIndex: 'y'
					}]
				},
				dockedItems: [{
					xtype: 'toolbar',
					dock: 'top',
					enableOverflow: true,
					items: [{
						xtype: 'button',
						itemId: 'btnPointsAdd',
						text: _('Add'),
						iconCls: 'deviceswindowconversion_add'
					}, {
						xtype: 'button',
						itemId: 'btnPointsRemove',
						text: _('Remove'),
						iconCls: 'deviceswindowconversion_remove'
					}]
				}],
				plugins: [{
					pluginId: 'editor',
					ptype: 'rowediting'
				}]
			}],
			dockedItems: [{
				xtype: 'toolbar',
				dock: 'top',
				items: [{
					itemId: 'btnSave',
					text: _('Save'),
					iconCls: 'save'
				}, {
					itemId: 'btnReset',
					text: _('Reset'),
					iconCls: 'reset'
				}, {
					xtype: 'tbseparator'
				}, {
					itemId: 'btnCancel',
					text: _('Cancel'),
					iconCls: 'cancel'
				}]
			}]
		});
		this.callParent(arguments);
		// variables initialization
		this.graph = this.down('#graph');
		this.btnSave = this.down('#btnSave');
		this.btnReset = this.down('#btnReset');
		this.btnCancel = this.down('#btnCancel');
		this.btnChangeSmoothing = this.down('#btnChangeSmoothing');
		this.btnCheckValue = this.down('#btnCheckValue');
		this.btnPointsAdd = this.down('#btnPointsAdd');
		this.btnPointsRemove = this.down('#btnPointsRemove');
		this.fieldX = this.down('textfield[name=x]');
		this.fieldY = this.down('textfield[name=y]');
		this.pointsGrid = this.down('#pointsGrid');
		this.pointsEditor = this.pointsGrid.getPlugin('editor');
	}
});