/**
 * @class O.comp.MapDetailInfo
 * @extends O.comp.DeviceInfo
 */
C.define('O.comp.MapDetailInfo', {
	extend: 'O.comp.DeviceInfo',
	alias: 'widget.mapdeviceinfo',

	/*
	 * Создает грид (и стор для него) для отображения данных пакета
	 */
	getGridPanel: function() {
		//стор
		var store = Ext.create('Ext.data.Store', {
			storeId: 'packetPropertiesStore',
			model: 'O.mon.model.PacketProp',
			autoload: false,
			proxy: {
				type: 'memory'
			}
		});
		return {
			xtype: 'gridpanel',
			flex: 1,
			border: false,
			hideHeaders: true,
			store: store,
			cls: 'wrappedgrid',
			columns: [{
				header: '',
				dataIndex: 'packetItemName',
				width: 120,
				fixed: true
			}, {
				itemId: 'dataColumn',
				header: '',
				dataIndex: 'packetItemValue',
				flex: 1,
				renderer: this.renderer
			}]
		}
	},

	/*
	 * Возвращает массив вкладок
	 */
	getItems: function() {
		var items = this.callParent(arguments);
		var me = this;

		items.unshift({
			title: _('Properties'),
			xtype: 'panel',
			itemId: 'deviceinfo',
			tabtype: 'information',
			iconCls: 'mi0',
			ownerStore: this.ownerStore,
			layout: {
				type: 'vbox',
				align: 'stretch'
			},
			border: false,
			items: [
				this.getGridPanel(),
			]/*,
			dockedItems: [{
				xtype: 'toolbar',
				dock: 'top',
				enableOverflow: true,
				items: [{
					xtype: 'tbfill'
				}, {
					xtype: 'panel',
					itemId: 'callClock',
					cls: 'call-clock-panel',
					hidden: true,
					html: '00:00'
				},{
					xtype: 'button',
					itemId: 'btnCall',
					state: true, // true - ready to call
					text: _('Call'),
					iconCls: 'call_btn'
				}]
			}]*/
		});

		if (C.userHasRight('mon_vehicle_driver')) {
			/*items.push({
				xtype: 'mapdrivers',
				hidden: false
			});*/
		}

		items.push({
			xtype: 'waylistinfo',
			hidden: true
		});

		if (C.userHasRight('mon_device_command_template')) {
			items.push({
				xtype: 'mapcommands',
				hidden: false
			});
		}

		return items;
	}
});