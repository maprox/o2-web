/**
 * Device adding and manipulating functionality
 * ===============================
 *
 * Description goes here
 *
 * @class C.lib.map.Tracking
 * @extends C.lib.map.Device
 */

Ext.define('C.lib.map.Tracking', {
	extend: 'C.lib.map.Device',

	DEFAULT_MOVEMENT_COLOR: '0000ff',
	DEFAULT_DIRECTION_COLOR: '008800',
	VECHILE_ZINDEX: 51000,

	defaultPath: {
		strokeColor: '#0033FF', // В формате RGB
		strokeOpacity: 0.5,
		strokeWidth: 4,
		graphicZIndex: 410
	},
	interruptedPath: {
		strokeColor: '#0033FF', // В формате RGB
		strokeOpacity: 0.15,
		strokeWidth: 3,
		graphicZIndex: 410
	},

	/**
	 * Смещение иконок статуса по осям координат относительно друг друга и
	 * местоположения устройства (в пикселях)
	 */
	iconOffsetX: 20,
	iconOffsetY: 20,

	/**
	 * Ширина прогрессбара на различных уровнях сигнала со спутников
	 */
	progressWidth: new Array(4, 4, 4, 4, 8, 8, 12, 12, 16),

	/**
	 * Набор описаний статусов для отображения статуса устройства
	 */
	deviceStatuses: {
		lost: {icon: 'status_lost', text: 'Device is lost'},
		lowsat: {icon: 'status_satellites', text: 'Too few satellites'}
	},

	/**
	 * Initialization
	 */
	onAfterInit: function() {
		C.bind('mon_packet', this);
		this.callParent(arguments);
	},

	/**
	 * Templates
	 */
	onInitTemplates: function() {
		this.callParent(arguments);
		this.lngTemplateZoneDevices = new Ext.XTemplate(
			'<tpl for="devices">',
			'<tpl if="xindex == 1">',
			'<tr><td><b>' + _('In geofence') + ':</b></td>',
			'<tpl else>',
			'<tr><td></td>',
			'</tpl>',
			'<td class="fake_anchor"><span class="device device_{id}">',
			'{name}',
			'</span></td></tr>',
			'</tpl>',
			'<tpl if="devices.length &gt; 1">',
			'<tr><td colspan="2">&nbsp;</td></tr>',
			'<tr>&nbsp;<td>',
			'</td><td class="fake_anchor"><span class="device_all">',
			_('Select all'),
			'</span></td></tr>',
			'</tpl>'
		);
	},

	/**
	 * Updating packets
	 * @param {Array} data
	 */
	onUpdateMon_packet: function(data) {
		if (!Ext.isEmpty(data)) {
			// making list of device id with new packets
			var devices = [];
			for (var i = 0; i < data.length; i++) {
				var packet = data[i];
				if (!Ext.Array.contains(devices, packet.id_device)) {
					devices.push(packet.id_device);
				}
			}
			// update devices which is on the map
			this.devicesUpdate(this.getDevices().getByKeys(devices));
		}
	},

	/**
	 * Включение отображения последних N точек маршрута
	 * @param {boolean} show - Отображать или нет
	 */
	showLastPoints: function(show) {
		if (this.trackingSettings.showLastPoints == show) { return; }

		this.trackingSettings.showLastPoints = show;
		this.updateMap(true);
	},

	/**
	 * Отрисовка устройства на карте
	 * @param {O.mon.model.Device} device
	 */
	deviceDraw: function(device) {
		device.packetsSort();
		var list = this.getPointsList(device);
		device.display = {
			path: this.drawPathPolyline(list,
				this.trackingSettings.showLastPoints),
			arrows: this.drawArrows(list, this.DEFAULT_MOVEMENT_COLOR,
				this.trackingSettings.showLastPoints),
			status: this.drawStatusIcon(device),
			direction: this.drawDirectionArrow(device),
			icon: this.drawDeviceIcon(device),
			label: this.drawDeviceLabel(device)
		}
		if (this.trackingSettings.showDeviceLabels) {
			device.display.label.show();
		}
		device.display.direction.show();
	},

	/**
	 * Стирание устройства с карты
	 * @param {O.mon.model.Device} device
	 */
	deviceErase: function(device) {
		if (!device.display) { return }
		for (var i = 0; i < device.display.path.length; i++) {
			device.display.path[i].destroy();
		}
		for (var i = 0; i < device.display.arrows.length; i++) {
			var arrow = device.display.arrows[i];
			if (!arrow.getPacket() || !arrow.getPacket().isSos()) {
				arrow.destroy();
			}
		}
		device.display.icon.destroy();
		device.display.label.destroy();
		if (device.display.status.popup) {
			device.display.status.popup.destroy();
		}
		device.display.status.destroy();
		device.display.direction.destroy();
		delete device.display;
	},

	/**
	 * Включение/выключение режима "Следить за выбранными"
	 * @param {Boolean} follow - Следить или нет
	 * @param {Boolean} noUpdate - Обновить треки и отцентрировать машину, или нет
	 */
	toggleSelectedTracking: function(follow, noUpdate) {
		noUpdate = noUpdate || false;

		this.trackingSettings.selectedTracking = follow;
		if (!noUpdate) {
			this.updateMap();
		}
	},

	/**
	 * Обновить данные устройств на карте
	 * @param {O.mon.model.Device[]} devices Массив Объектов устройств
	 */
	devicesUpdate: function(devices) {
		if (!this.isLoaded()) { return; }

		this.redrawDevices(devices);

		// Перемещаем центр карты чтобы отобразить выделенное устройство
		if (this.trackingSettings.selectedTracking) {
			var selectedId = this.getSelectedObject('mon_device');
			var d = this.getDevices().getByKey(selectedId);
			if (d) {
				var packet = d.getLastPacket(true);
				if (packet &&
					(!d.lastUpdatePan || d.lastUpdatePan != packet.id)) {
					d.lastUpdatePan = packet.id;
					this.getEngine().moveToPoints([packet]);
				}
			}
		}
	},

	/**
	 * Метод обновления данных и центрирования на выбранном устройстве
	 * @param {Boolean} isZoomEvent If true, then do not use bounds
	 */
	onMapUpdate: function(isZoomEvent) {
		// Рисуем устройства
		this.redrawDevices(this.getDevices().getRange());

		if (!isZoomEvent && this.trackingSettings.selectedTracking) {
			this.focusSelectedDevice();
		}
	},

	getPointsList: function(device) {
		var pointList = [];
		//Получаем количество отображаемых точек
		var pointsCount = parseInt(C.getSetting('p.pointscount'));
		device.each(function(packet) {
			if (pointsCount <= 1) { return; } // limited by PointsCount
			pointsCount--;
			if (packet.state == 1) {
				pointList.push(packet);
			}
		}, this);
		return pointList;
	},

	/**
	 * Сформатировать данные для метки устройства
	 * @param {Object} device объект с информацией об устройстве
	 * @param {Object} packet объект с информацией о пакете
	 */
	getDeviceLabelData: function(device, packet){
		return [];
	},

	/**
	 * Returns additional data for geozone baloon
	 * @param {O.mon.model.Geofence} zone Geozone object
	 */
	getAdditionalZoneData: function(zone) {
		return (zone.devices && zone.devices.length) ?
			this.lngTemplateZoneDevices.apply(zone) :
			'';
	},

	/**
	 * Показать блок информации об устройстве
	 * @param {Object} device объект с информацией об устройстве из this.devices
	 */
	drawDeviceLabel: function(device) {
		var packet = device.getLastPacket(true);
		if (!packet) {
			return this.getEngine().getDummy();
		}

		var position = C.getSetting('p.labelpos');
		return this.getEngine().addTextLabel(packet.latitude, packet.longitude,
			this.getDeviceLabelData(device, packet), position);
	},

	/**
	 * Отрисовка иконки статуса для устройства
	 * @param {O.mon.model.Device} device - объект устройства
	 */
	drawDeviceIcon: function(device) {
		var packet = device.getLastPacket(true);
		if (!packet) {
			return this.getEngine().getDummy();
		}

		return this.getEngine().addMarker({
			packet: packet,
			img: device.imagealias,
			isDevice: true,
			zindex: this.VECHILE_ZINDEX
		});
	},

	/**
	 * Отрисовка иконки статуса для устройства
	 * @param {O.mon.model.Device} device - объект устройства
	 */
	drawDirectionArrow: function(device) {
		var packet = device.getLastPacket(true);
		if (
			!packet
			|| packet.azimuth === undefined
			|| !device.isMoving()
		) {
			return this.getEngine().getDummy();
		}

		//Если задан азимут и машинка движется, то рисуем стрелку
		return this.drawMovementArrow(packet,
			this.DEFAULT_DIRECTION_COLOR, false);
	},

	/**
	 * Отрисовка иконки статуса для устройства
	 * @param {O.mon.model.Device} device - объект устройства
	 * @return {C.lib.map.openlayers.entity.abstract.Point}
	 */
	drawStatusIcon: function(device) {
		var packet = device.getLastPacket(true);
		if (!packet || device.isConnected()) {
			return this.getEngine().getDummy();
		}

		//статус "движется/нет" и т.д.
		var icon = this.deviceStatuses['lowsat'].icon;
		var text = this.deviceStatuses['lowsat'].text;
		if (device.isLost()) {
			icon = this.deviceStatuses['lost'].icon;
			text = this.deviceStatuses['lost'].text;
		}
		text = _(text.replace('/\s/g', '&nbsp'));

		var status = this.getEngine().addMarker({
			packet: packet,
			img: icon,
			offsetX: this.iconOffsetX,
			offsetY: -this.iconOffsetY
		});
		status.popup = this.getEngine().addMarkerTooltip(status, text);
		return status;
	},

	/**
	 * Отрисовка линии по точкам
	 * @param {Array} pointList Список точек
	 * @param {boolean} display Show line after drawing
	 */
	drawPathPolyline: function(pointList, display) {
		display = (typeof display == 'undefined') ? true : display;

		var result = [],
			lineParts = [],
			currPart = -1,
			currStyle = '',
			newStyle = '';

		if (pointList.length == 0) {
			return result;
		}

		for (var key in pointList) {
			var curr = parseInt(key),
				next = curr + 1;

			if (next < pointList.length &&
				(pointList[curr].getMetricDistanceTo(pointList[next]) > C.cfg.packets.maxDistance ||
					pointList[next].time - pointList[curr].time > C.cfg.packets.maxDistance * 1000)
				) {
				newStyle = 'interruptedPath';
			} else {
				newStyle = 'defaultPath';
			}

			if (currStyle != newStyle) {
				if (curr != 0) {
					lineParts[currPart].data.push(pointList[curr]);
				}

				currPart++;
				lineParts[currPart] = {data: [], style: newStyle};
				currStyle = newStyle;
			}

			lineParts[currPart].data.push(pointList[curr]);

			if (typeof pointList[next] == "undefined") {
				break;
			}
		}

		for (var i = 0; i < lineParts.length; i++) {
			var linePart = lineParts[i],
				style = Ext.clone(this[linePart.style]),
				line = this.getEngine().addLine(linePart.data, style);
			if (display) {
				line.show();
			}
			result.push(line);
		}

		return result;
	},

	/**
	 * Включение/выключение блоков отображения информации об устройстве
	 * @param {boolean} show - показывать или нет
	 */
	toggleDeviceLabels: function(show) {
		this.trackingSettings.showDeviceLabels = show;
		if (!this.isLoaded()) {
			return;
		}
		this.getDevices().each(function(device){
			if (show) {
				device.display.label.show();
			} else {
				device.display.label.hide();
			}
		});
	}
});