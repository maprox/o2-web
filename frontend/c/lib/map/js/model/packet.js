/**
 * Packet manipulating functionality
 * ===============================
 *
 * Description goes here
 *
 * @class C.lib.map.Packet
 * @extends Ext.Base
 */

Ext.define('C.lib.map.Packet', {
	extend: 'Ext.Base',

	MOVING_ZINDEX: 29000,
	MOVEMENT_ICONS: 36,
	MOVE_ICONS_ANGLE: 10,

	/**
	 * Отображенные id маркеров сос-пакетов
	 */
	displayedSosPackets: [],

	/**
	 * Distance between two points on which we must draw marker
	 * on the less distance no marker will be drawn
	 */
	ZOOM_TOLERANCE: [
		110.592,
		55.296, // 1
		27.648, // 2
		6.912, // 3
		3.456, // Values down from this is veryfied
		1.728, // 5
		0.864, // 6
		0.432, // 7
		0.216, // 8
		0.108, // 9
		0.054, // 10
		0.027, // 11
		0.018,
		0.009,
		0.004,
		0.002,
		0.001,
		0.0,
		0.0,
		0.0,
		0.0
	],

	/**
	 * Initialization
	 */
	onAfterInit: function() {
		// Каждому объекту движка - свой кеш сос-пакетов
		this.displayedSosPackets = [];

		this.on({
			selectpacket: this.onSelectPacket,
			scope: this
		});
	},

	/**
	 * Templates
	 */
	onInitTemplates: function() {
		this.lngTemplatePacket = {
			begin: '<table class="packet_balloon_{0}">',
			param: '<tr><td><b>{0}:</b></td><td>{1}</td></tr>',
			device: '<tr><td><b>' + _('Device') +
				':</b></td><td>{0}</td></tr>',
			time_obtained: '<tr><td><b>' + _('Time obtained') +
				':</b></td><td>{0}</td></tr>',
			status: '<tr><td><b>' + _('Status') + ':</b></td><td>' +
				_('alert') + '</td></tr>',
			speed: '<tr><td><b>' + _('Speed') +
				':</b></td><td>{0}</td></tr>',
			odometer: '<tr><td><b>' + _('Odometer') +
				':</b></td><td>{0}</td></tr>',
			acc: '<tr><td><b>' + _('Ignition') +
				':</b></td><td>{0}</td></tr>',
			voltage: '<tr><td><b>' + _('Voltage') +
				':</b></td><td>{0} V</td></tr>',
			coordinates: '<tr><td><b>' + _('Coordinates') +
				':</b></td><td>{0}</td></tr>',
			address: '<tr><td><b>' + _('Address') +
				':</b></td><td>{0}</td></tr>',
			satellites: '<tr><td><b>' + _('Satellites count') +
				':</b></td><td>{0}</td></tr>',
			end: '</table>'
		}

		this.lngTemplateSos = '<table>' +
			'<tr><td colspan="2"><b>' + _('Sos button pressed!') +
			'</b></td></tr>' +
			'<tr><td><b>' + _('Device') +
			':</b></td><td>{0}</td></tr>' +
			'<tr><td><b>' + _('Time') +
			':</b></td><td>{1}</td></tr>' +
			'<tr><td class="fake_anchor padded"><span class="sos_select">' +
			_('Select device') + '</span></td>' +
			'<td class="fake_anchor padded fake_anchor_right">' +
			'<span class="sos_hide">' +
			_('Hide') +
			'</span></td></tr>' +
			'</table>';


		/* [Выбрать устройство] - При нажатии выбирает устройство (check и select) из списка устройств
		   [Скрыть] - убирает иконку с карты */
	},

	/**
	 * Common function for drawing gathered arrows
	 * @param {O.mon.model.Packet[]} packets track points array
	 * @param {string} color Track color
	 * @param {boolean} display Show arrows on map immediately
	 */
	drawArrows: function(packets, color, display) {
		display = (typeof display == 'undefined') ? true : display;
		// After filtering array of packets we need to draw, reverse them.
		// So last packets by time will be added to html also last.
		// This way, they will overlap earlier packets.
		packets = this.filterPackets(packets).reverse();

		var markers = [];
		for (var i = 0; i < packets.length; i++) {
			marker = this.drawMovementArrow(packets[i], color);
			marker.setDoPopup(true);
			if (display) {
				marker.show();
			}
			markers.push(marker);
		}
		return markers;
	},

	/**
	 * Daraws sensor points
	 * @param {O.mon.model.Packet[]} packets track points array
	 * @param {string} color Track color
	 * @param {boolean} display Show arrows on map immediately
	*/
	drawSensorPoints: function(packets, color, display) {
		display = (typeof display == 'undefined') ? true : display;

		packets = this.filterSensorPackets(packets).reverse();

		// Draw sensor points only if track includes one packet
		if (packets.length == 1) {
			var markers = [];
			for (var i = 0; i < packets.length; i++) {
				marker = this.drawSensorPoint(packets[i], color);
				if (display) {
					marker.show();
				}
				markers.push(marker);
			}
		}

		return markers;
	},

	/**
	 * Packet selection handler
	 * @param {C.lib.map.openlayers.entity.Marker} marker
	 */
	onSelectPacket: function(marker) {
		if (!marker.getPacket()) { return; }

		if (marker.getDoPopup()) {

			var packet = marker.getPacket();
			var click = null;
			var html = '';
			if (packet.isSos()) {
				// Рисуем сообщение о сос-сигнале
				html = this.formatSosData(packet);
				click = this.processSosClick;
			} else {
				html = this.formatPacketData(packet);

				if (packet.address === null) {
					var me = this;
					packet.getAddress(function(address, packet) {
						me.onSelectPacket(marker);
					});
				}
			}

			this.showBaloon(html, packet.latitude, packet.longitude,
				click, marker);
		}

		if (marker.getIsDevice()) {
			// Кидаем дальше
			this.fireEvent('selectdevice', marker.getPacket().device.id);
		}
	},

	/**
	 * Filters packet by current map zoom
	 * @param {O.mon.model.Packet[]} packets
	 * @return {Array}
	 */
	filterPackets: function(packets) {
		var result = [];
		var t = this.ZOOM_TOLERANCE[this.getEngine().getZoom()];
		var i = 0;
		var lastPacket = null;

		for (var i = 0; i < packets.length; i++) {
			var packet = packets[i];

			//we must draw first packet
			if (lastPacket == null) {
				lastPacket = packet;
			}

			var draw = true;
			var dist = packet.getDistanceTo(lastPacket);
			if (dist < t && lastPacket != packet) {
				draw = false;
			}
			//We must draw last packet
			if (i == packets.length - 1) {
				draw = true;
			}
			if ((i == 0) && this.filterFirstPacket()) {
				draw = false;
			}

			//We must draw SOS packet
			if (packet.isSos()) {
				if (!Ext.Array.contains(this.displayedSosPackets, packet.id)) {
					draw = true;
					this.displayedSosPackets.push(packet.id);
				} else {
					draw = false;
				}
			}

			if (draw) {
				lastPacket = packet;
				result.push(packet);
			}
			i++;
		}

		return result;
	},

	/**
	 * Filters sensor packets by current map zoom
	 * @param {O.mon.model.Packet[]} packets
	 * @return {Array}
	 */
	filterSensorPackets: function(packets) {
		// TODO: the function is very simillar with filterPackets
		var result = [];
		var t = this.ZOOM_TOLERANCE[this.getEngine().getZoom()];
		var i = 0;
		var lastPacket = null;

		for (var i = 0; i < packets.length; i++) {
			var packet = packets[i];
			//we must draw first packet
			if (lastPacket == null) {
				lastPacket = packet;
			}

			var draw = true;
			var dist = packet.getDistanceTo(lastPacket);
			if (dist < t && lastPacket != packet) {
				draw = false;
			}
			//We must draw last packet
			if (i == packets.length - 1) {
				draw = true;
			}

			if (draw) {
				lastPacket = packet;
				result.push(packet);
			}
			i++;
		}

		return result;
	},

	/**
	 * Добавление маркера, связанного с пакетом данных
	 * @param {O.mon.model.Packet} packet Объект пакета данных
	 * @param {String} image Название изображения
	 * @return {Object} Объект маркера
	 */
	addPacketPoint: function(packet, image) {
		return this.getEngine().addMarker({
			packet: packet,
			img: image,
			doPopup: true
		});
	},

	/**
	 * Returns whether first packet should be filtered or not
	 * @return {Boolean}
	 */
	filterFirstPacket: function() {
		return true;
	},

	/**
	 * Shows device information in cloud popup
	 * @param {O.mon.model.Packet} packet Packet object
	 * @return {String}
	 */
	formatPacketData: function(packet) {
		var t = this.lngTemplatePacket;
		var string = "" + Ext.String.format(t.begin,
			packet.id_type == 1 ? 'alert' : 'normal');
		string += Ext.String.format(t.device, packet.device.getName());
		string += Ext.String.format(t.time_obtained,
			packet.getTime("d-m-Y H:i:s"));
		if (packet.id_type == 1) {
			string += Ext.String.format(t.status, packet.device.getName());
		}
		string += Ext.String.format(t.speed, C.utils.fmtSpeed(packet.speed));
		var odometer = packet.getOdometerExt();
		if (odometer) {
			string += Ext.String.format(t.odometer, odometer);
		}
		if (packet.getSensorValue('extvoltage') !== null) {
			string += Ext.String.format(t.voltage,
				Number(packet.getSensorValue('extvoltage') / 1000).toFixed(2)
			);
		}
		string += Ext.String.format(t.coordinates, C.utils.fmtCoord(packet));

		// Sensors
		Ext.Array.each(packet.getDisplaySensors(), function(sensor) {
			string += Ext.String.format(t.param, sensor.name, sensor.value);
		});


		if (packet.address !== null) {
			string += Ext.String.format(t.address, packet.address);
		} else {
			string += Ext.String.format(t.address,
				'<div class="loader">&nbsp;</div>');
		}

		string += Ext.String.format(t.satellites,
			parseInt(packet.satellitescount || 0));

		string += t.end;

		return string;
	},

	getLoadPacketData: function() {
		return 'testtest';
	},

	/**
	 * Draw movement direction arrow
	 * @param {O.mon.model.Packet} packet Packet object
	 * @param {string} color Color of arrow
	 * @param {boolean} static_arrow Make arrow static
	 */
	drawMovementArrow: function(packet, color, static_arrow) {
		static_arrow = (static_arrow === undefined) ? true : static_arrow;
		var anglePart = Math.round(packet.azimuth / this.MOVE_ICONS_ANGLE);
		//Чтобы не выйти за пределы массива
		if (anglePart > this.MOVEMENT_ICONS - 1) {
			anglePart = anglePart % this.MOVEMENT_ICONS;
		}
		var alias = (static_arrow) ? 's' + anglePart * this.MOVE_ICONS_ANGLE :
			anglePart * this.MOVE_ICONS_ANGLE;

		var image = (packet.isSos()) ? 'sos_packet' :
			this.getEngine().getMovementIcon(alias, color);

		return this.getEngine().addMarker({
			packet: packet,
			img: image,
			zindex: this.MOVING_ZINDEX
		}, false);
	},


	/**
	 * Draw sensor point
	 * @param {O.mon.model.Packet} packet Packet object
	 * @param {string} color Color of arrow
	 * @param {boolean} static_arrow Make arrow static
	 */
	drawSensorPoint: function(packet, color, static_arrow) {
		static_arrow = (static_arrow === undefined) ? true : static_arrow;

		var engine = this.getEngine();

		var style = this.sensorPointStyle;
		style.fillColor = '#' + color;
		style.strokeColor = '#' + color;

		var params = {
			latitude: packet.latitude,
			longitude: packet.longitude,
			style: style
		}

		return engine.addSensorMarker(params);
	},

	/**
	 * Обрабатывает нажатие на баллон с сос-сигналом
	 */
	processSosClick: function(event, baloon, marker) {
		var cls = event.target.className;

		if (cls == 'sos_select') {
			var packet = marker.getPacket();
			this.fireEvent('checkdevice', packet.id_device);
			this.fireEvent('selectdevice', packet.id_device);
			baloon.destroy();
		} else if (cls == 'sos_hide') {
			baloon.destroy();
			marker.destroy();
		}
	},

	/**
	 * Creates sos baloon
	 * @param {Object} obj data
	 */
	formatSosData: function(obj) {
		var store = C.getStore('mon_device');
		var index = store.findExact('id', obj.id_device);
		if (index > -1) {
			var deviceName = store.getAt(index).get('name');
		} else {
			var deviceName = '';
		}
		var date = C.utils.fmtDate(obj.time.pg_utc(C.getSetting('p.utc_value')),
			O.format.Time);
		return Ext.String.format(this.lngTemplateSos,
			deviceName, date);
	}
});