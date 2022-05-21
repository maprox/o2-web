/**
 * Zones adding and manipulating functionality
 * ===============================
 *
 * Description goes here
 *
 * @class C.lib.map.Zone
 * @extends Ext.Base
 */

Ext.define('C.lib.map.Zone', {
	extend: 'Ext.Base',

	zoneStyle: {
		strokeWidth: 4,
		fillOpacity: 0.5,
		graphicZIndex: 300
	},

	/**
	 * @protected
	 * @cfg Ext.util.MixedCollection
	 */
	zones: null,

	/**
	 * Initialization
	 */
	onAfterInit: function() {
		this.on('engineload', function(){
			this.getEngine().on({
				geometry_clicked: this.onGeofenceClick,
				scope: this
			});
		});
		C.bind('mon_geofence', this);
	},

	/**
	 * Templates
	 */
	onInitTemplates: function() {
		this.lngTemplateZoneStart = '<table>' +
			'<tr><td><b>' + _('Zone') + ':</b></td><td>{0}</td></tr>' +
			'<tr><td><b>' + _('Space') + ':</b></td><td>{1} ' + _('km') +
			'<sup>2</sup></td></tr>' +
			'<tr><td><b>' + _('Address') + ':</b></td><td>{2} </td></tr>';
		this.lngTemplateZoneEnd = '</table>';
	},

	/**
	 * Updating geofence
	 * @param {Array} data
	 */
	onUpdateMon_geofence: function(data) {
		// Remove zones if needed
		for (var j = 0; j < data.length; j++) {
			var geofence = data[j];
			if (geofence.state === C.cfg.RECORD_IS_TRASHED) {
				var geofenceObj = this.zones.getByKey(geofence.id);
				if (!geofenceObj) {
					continue;
				}
				this.removeZone(geofenceObj);
			}
		}

		if (!this.infoBaloon || !this.infoBaloon.zone) {
			return;
		}
		for (var i = 0; i < data.length; i++) {
			var zone = data[i];
			if (zone.id == this.infoBaloon.zone.id) {
				this.infoBaloon.zone.inside = zone.inside;
				this.showZoneBaloon(this.infoBaloon.zone);
			}
		}
	},

	/**
	 * Getter for zones param
	 * @return Ext.util.MixedCollection
	 * @protected
	 */
	getZones: function() {
		if (this.zones === null) {
			this.zones = new Ext.util.MixedCollection();
		}
		return this.zones;
	},

	/**
	 * Обновление списка выбранных геозон на карте.
	 * В качестве параметра list может выступать массив идентификаторов устройств
	 * либо массив объектов {@link O.mon.model.Geofence}
	 * @param {O.mon.model.Geofence[]} list Список выбранных устройств
	 * @param {Boolean} redraw Необходимость перерисовки карты
	 * @param {Boolean} silent True to prevent selection of zone
	 */
	setZones: function(list, redraw, silent) {
		if (!this.isLoaded()) { return; }
		this.clearZones(redraw);
		/** Список устройств, загруженных в карту */
		if (list.length == 0) {
			return;
		}
		/** Полный список всех геозон, доступных пользователю */
		C.get('mon_geofence', function(mlistTotal) {
			// пробегаем по списку переданных идентификаторов
			// (или объектов O.mon.model.Geofence)
			var selected = this.getSelectedObject('mon_geofence');
			for (var i = 0; i < list.length; i++) {
				var item = list[i];
				if (!(item instanceof O.mon.model.Geofence)) {
					item = mlistTotal.get(item);
				}
				if (item) {
					this.addZone(item);
					if (!silent && selected === item.getId()) {
						this.getEngine().zoomToPoints(item.coords);
					}
				}
			}
		}, this);
	},

	/**
	 * Метод, который убирает все геозоны с карты
	 * @param {Boolean} redraw Необходимость перерисовать карты после очищения
	 */
	clearZones: function(redraw) {
		redraw = redraw || false;

		while (this.getZones().getCount() > 0) {
			this.removeZone(this.getZones().first());
		}
		if (this.isLoaded() && redraw) {
			this.updateMap();
		}
	},

	/**
	 * Zone updating
	 */
	updateZones: function(redraw, silent) {
		redraw = redraw || false;
		silent = silent || true;
		this.setZones(this.getZones().getRange(), redraw, silent);
	},

	/**
	 * Returns true if zone is selected
	 * @param {O.mon.model.Geofence} z Zone object
	 * @return {Boolean}
	 */
	hasZone: function(z) {
		return this.getZones().contains(z);
	},

	/**
	 * Добавление устройства к списку
	 * @param {O.mon.model.Geofence} z
	 * @private
	 */
	addZone: function(z) {
		if (z && !this.hasZone(z)) {
			if (this.isLoaded()) {
				var pointList = [];

				z.each(function(coord) {
					pointList.push(coord);
				}, this);

				var drawingOptions = Ext.apply({
					strokeColor: '#' + z.color, // В формате RGBA
					fillColor: '#' + z.color // В формате RGBA
				}, this.zoneStyle);

				z.geometry = this.getEngine()
					.addPolygon(pointList, drawingOptions);
			}
			this.getZones().add(z);
		}
	},

	/**
	 * Удаление устройства из списка отображаемых
	 * @param {O.mon.model.Geofence} z
	 * @private
	 */
	removeZone: function(z) {
		if (this.hasZone(z)) {
			this.getZones().remove(z);
			if (this.isLoaded() && z.geometry) {
				z.geometry.destroy();
			}
			if (
				this.infoBaloon
				&& this.infoBaloon.zone
				&& this.infoBaloon.zone.id == z.id
			) {
				// Эту привязку тоже надо убирать
				this.infoBaloon.zone = null;
			}
		}
	},

	/**
	 * Primitive (such a geozone) click event handler
	 * @param {Number} geometryId clicked id
	 */
	onGeofenceClick: function(geometryId) {
		this.getZones().each(function(zone) {
			if (zone.geometry.matchId(geometryId)) {
				this.showZoneBaloon(zone);
			}
		}, this);
	},

	/**
	 * Displays geozone info in baloon
	 * @param {O.mon.model.Geofence} zone
	 */
	showZoneBaloon: function(zone) {
		C.get('mon_device', function(devices) {
			zone.devices = [];
			for (var i = 0; i < zone.inside.length; i++) {
				var device = devices.getByKey(zone.inside[i]);
				if (device && device.state == 1) {
					zone.devices.push(device);
				}
			}

			var point = zone.geometry.getCentroid();
			var ll = this.getEngine().getPoint(point.y, point.x, true);
			this.showBaloon(this.formatZoneData(zone), ll.lat, ll.lon,
				this.processGeofenceClick, zone);
			this.infoBaloon.zone = zone;
		}, this);
	},

	/**
	 * Creates geozone baloon
	 * @param {O.mon.model.Geofence} zone Geozone object
	 */
	formatZoneData: function(zone) {
		var engine = this.getEngine();
		var map = engine.getMap();
		// @todo эту логику - внутрь Entity
		var area = Math.abs(Number(zone.geometry.getFeature().geometry.getGeodesicArea(
			map.getProjectionObject()
		) / 1000000).toFixed(2));
		var address = (zone.address == null) ? '' : zone.address;

		var ret = Ext.String.format(this.lngTemplateZoneStart,
			zone.getName(), area, address
		);

		if (this.getAdditionalZoneData) {
			ret += this.getAdditionalZoneData(zone);
		}

		ret += Ext.String.format(this.lngTemplateZoneEnd);

		return ret;
	},

	/**
	 * Обрабатывает нажатие на баллон геозоны
	 */
	processGeofenceClick: function(event, baloon, zone) {
		var cls = event.target.className;
		if (cls.match(/device_(\d+)/)) {
			var id = parseInt(cls.match(/device_(\d+)/)[1]);
			this.fireEvent('checkdevice', id);
			this.fireEvent('selectdevice', id);
		} else if (cls.match(/device_all/)) {
			this.fireEvent('checkdevice', zone.inside);
			this.fireEvent('selectdevice', zone.inside[0]);
			baloon.destroy();
		}
	}
});