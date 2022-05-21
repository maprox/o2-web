/**
 * @fileOverview Панель информации о устройствое
 * @author <a href="mailto:sunsay@maprox.net">Ляпко Александр</a>
 *
 * @class O.comp.DeviceInfo
 * @extends Ext.tab.TabPanel
 */
C.define('O.comp.DeviceInfo', {
	extend: 'Ext.tab.Panel',
	alias: 'widget.deviceinfo',

/**
	* Граница. Отключена по-умолчанию
	* @type Boolean
	* @default false
	*/
	border: false,

/**
	* Объект пакета, о котором выводится информация
	* @type O.mon.model.Packet
	*/
	packet: null,

/** Текстовые поля */
	msgDeviceStatus: 'Status',
	msgDeviceStatusMove: 'Move',
	msgDeviceStatusStay: 'Stay',
	msgDeviceStatusParking: 'Parking',
	msgDeviceStatusDisconnected: 'Disconnected %s',
	msgDeviceConnected: 'Connection',
	msgDeviceConnectionDropped: 'Connected',
	msgDeviceConnectionOpen: 'Unconnected',
	msgDeviceConnectionUnconfigured: 'Not configured yet',
	msgDeviceLastData: 'Last data',
	msgDeviceBatteryUnknown: 'Unknown',
	msgDevicePlace: 'Place',

/**
	* @constructs
	*/
	initComponent: function() {
		Ext.apply(this, {
			ctCls: 'mipanel',
			//collapseMode: 'mini',
			plain: false,
			defaults: {autoScroll: true},
			activeTab: 0,
			layout: 'fit',
			items: this.getItems()
		});
		this.callParent(arguments);
	},

/**
	* Рендеринг индикатора сигнала GPS
	* @param {int} value - кол-во спутников
	*/
	renderer: function(value, meta, record, rowIndex) {
		if (record.get('packetItemName') == _('GPS signal')) {
			var progressWidth = [4, 4, 4, 4, 8, 8, 12, 12, 16],
				position = value;
			if (position > progressWidth.length - 1) {
				position = progressWidth.length - 1;
			}
			var str = "<div class='gps-signal-info'"
				+ "data-qtip='"
				+ _('Satellites') + ": " + value
				+ "' >" +
				"<div class='gps-signal-meter' style='width: " +
				progressWidth[value] + "px !important;'></div></div>";
			return str;
		} else if (record.get('packetItemName') == _('Last image')) {
			var img = Ext.decode(value);
			var utc = C.getSetting('p.utc_value');
			var description = '';
			if (img.time) {
				description = Ext.util.Format.date(
					new Date().pg_fmt(img.time).pg_utc(utc),
					O.format.Timestamp
				);
			}
			var imgpath = '/mon_device_image/' + img.id + '/draw/small';
			var str = "<div class='last-image'>" +
					"<div class='last-image-description'>" +
						description +
					"</div>" +
					"<img src='" + imgpath + "'></img>"
				"</div>";
			return str;
		} else {
			return value;
		}
	},

/*
	* Возвращает массив вкладок
	*/
	getItems: function() {
		return [{
			title: _('Events'),
			xtype: 'eventsinfo',
			tabtype: 'events',
			iconCls: 'mi1'
		}];
	}
});
