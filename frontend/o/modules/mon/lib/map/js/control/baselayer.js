/**
 * Base layer class for map engine
 * ===============================
 *
 * Description goes here
 *
 * @class C.lib.map.Baselayer
 */

C.utils.inherit('C.lib.map.Baselayer', {

/**
	* Параметры рисования кружков стоянки
	*/
	_STOPPING_MIN_RADIUS: 15,
	_STOPPING_MAX_RADIUS: 50,
	_STOPPING_KOEF: 1.5,

/**
	* Локальный список устройств, отображаемых на карте
	* @type Ext.util.MixedCollection
	* @private
	*/

	MINIMAL_PANEL_WIDTH: 100,

	/**
	 * По клику, картинка меняется на fold.png
	 */
	tplStoppingLong: new Ext.XTemplate(
		'<div class="stopping">',
			'<img src="{[STATIC_PATH]}/img/unfold.png" class="slide" />',
			'{[O.timeperiod.formatPeriod(values.seconds * 1000)]}',
			'<div class="stopping_details">',
				'<tpl for="stops">',
					'<div class="line">',
						'<span class="date">{[values.stop_date]} ',
							'{[values.time_begin]}</span>',
						'<span class="spacer">-</span>',
						'<span class="text">',
							'{[O.timeperiod.formatPeriod(values.duration_seconds * 1000)]}',
						'</span>',
					'</div>',
				'</tpl>',
			'</div>',
		'</div>'
	),

/**
	* Component initialization
	*/
	initComponent: function() {
		this.initParameters();

		// panel configuration
		Ext.apply(this, {
			layout: 'fit'/*{
				type: 'vbox',
				align: 'stretch'
			}*/,
			firstLoad: true
		});
		this.callParent(arguments);

		this.on({
			resize: 'onResize',
			moveend: 'onMoveEnd',
			zoomend: 'onZoomEnd',
			switchlayer: 'onSwitchLayer',
			engineLoad: 'onEngineLoad',
			scope: this
		});
	},

/**
	* Метод, возвращающий указатель на список устройств.
	* При необходимости объект списка создается
	* @returns Ext.util.MixedCollection
	* @protected
	*/
	getInitialMapState: function() {
		var provider = Ext.state.Manager.getProvider();
		return {
			center: {
				lat: provider.get('baselayerMapCenterLat', this._INITIAL_LAT),
				lng: provider.get('baselayerMapCenterLon', this._INITIAL_LON)
			},
			zoom: provider.get('baselayerMapZoom', this._INITIAL_ZOOM)
		};
	},

/**
	* При изменении размеров компонента нужно подогнать под него размер карты
	* или загрузить движок если он еще не загружен и загрузка разрешена
	*/
	onResize: function() {
		if (this.isLoaded()) {
			//this.getEngine().setHeight(this.getSize().height);
			//this.getEngine().checkResize();
		} else {
			this.activateEngine();
		}
	},

/**
	* Overrides standart Ext.AbstractComponent::setLoading() method
	*/
	setLoading: function(load) {
		this.callParent(arguments);
		this.loading = load;
	},

/**
	* Активация движка карты
	* @private
	*/
	activateEngine: function() {
		if (!this.el || this.getWidth() < this.MINIMAL_PANEL_WIDTH) {
			return;
		}
		this.callParent(arguments);
	},

	/**
	 * Init engine parameters
	 * @param {C.lib.map.Engine} engine
	 */
	initEngine: function(engine) {
		this.callParent(arguments);
		//this.doLayout();
		this.setLoading(false);
	},

/**
	* Draws stoppings circles on map
	* @param {Ext.util.MixedCollection} stoppings Stoppings data
	*/
	drawStoppings: function(stoppings) {
		if (stoppings == null) { return []; }

		var drawnStoppings = [];

		Ext.each(stoppings, function(stopping) {
			stopping.radius = this.getStoppingRadius(stopping.getTime());
			stopping.duration_seconds = Math.max(stopping.getTime(), 60);
			stopping.longitude = parseFloat(stopping.get('start_point').longitude);
			stopping.latitude = parseFloat(stopping.get('start_point').latitude);

			stopping.stops = [{
				stop_date: Ext.Date.format(stopping.get('sdt'), O.format.DateShort),
				duration: stopping.get('duration'),
				duration_seconds: stopping.duration_seconds,
				time_begin: Ext.Date.format(stopping.get('sdt'), O.format.TimeShort),
				time_end: Ext.Date.format(stopping.get('edt'), O.format.TimeShort)
			}];

			var merged = false;
			Ext.each(drawnStoppings, function(drawnStopping) {
				if (this.getEngine().stoppingsNeedMerge(drawnStopping, stopping)) {

					drawnStopping.duration_seconds += stopping.getTime();
					drawnStopping.longitude = (stopping.longitude + drawnStopping.longitude) / 2;
					drawnStopping.latitude = (stopping.latitude + drawnStopping.latitude) / 2;
					drawnStopping.lonlat = false;

					drawnStopping.stops.push(stopping.stops[0]);

					merged = true;
					return false;
				}
			}, this);
			if (merged) { return; }

			drawnStoppings.push(stopping);
		}, this);

		Ext.each(drawnStoppings, function(stopping) {
			stopping.info = this.getEngine().addInscription(stopping.latitude,
				stopping.longitude, this.tplStoppingLong.apply({
					seconds: Math.max(stopping.duration_seconds, 60),
					stops: stopping.stops,
					number: stopping.get('id')
				}), this.slideStopping);
			stopping.circle = this.getEngine().addRing(stopping.latitude,
				stopping.longitude, stopping.radius, this.stoppingStyle);
		}, this);

		return drawnStoppings;
	},

	//Посчитать радус круга
	getStoppingRadius: function(seconds) {
		var r = Math.round(this._STOPPING_MIN_RADIUS +
			this._STOPPING_KOEF * seconds / 300);
		if (r > this._STOPPING_MAX_RADIUS) {
			r = this._STOPPING_MAX_RADIUS;
		}

		return r;
	},

	slideStopping: function(evt, div) {
		var el = Ext.get(div).select('div.stopping_details').first();
		var image = Ext.get(div).select('img.slide').first();

		if (el.isVisible()) {
			el.setVisibilityMode(Ext.Element.DISPLAY);
			el.hide();
			el.setVisibilityMode(Ext.Element.VISIBILITY);
			image.set({src: image.getAttribute('src').replace('fold', 'unfold')});
		} else {
			el.show();
			image.set({src: image.getAttribute('src').replace('unfold', 'fold')});
		}
	},

/**
	* Engine load handler
	* @private
	*/
	onEngineLoad: Ext.emptyFn,

/**
	* Обработчик движения карты
	* @param {Object} map Объект карты
	*/
	onMoveEnd: function(map) {
		if (!this.isLoaded()) { return; }

		var center = this.getEngine().getPoint(map.center.lat, map.center.lon, true);
		var provider = Ext.state.Manager.getProvider();
		provider.set('baselayerMapZoom', map.zoom);
		provider.set('baselayerMapCenterLat', center.lat);
		provider.set('baselayerMapCenterLon', center.lon);
	},

/**
	* Выключение режима редактирования
	*/
	stopGeoEditing: function() {
		var engine = this.getEngine();
		if (!engine) {
			return;
		}
		engine.stopEditing();
	},

/**
	* Инициализация режима редактирования созданного ранее примитива
	* @param {Object} zone Объект геозоны
	* @param {String} primitive Тип примитива
	*/
	startGeoEditing: function(zone, primitive) {
		var engine = this.getEngine();
		if (!engine) {
			return;
		}
		engine.startEditing(zone, primitive);
	},

/**
	* Инициализируем рисование примитива
	* @param {String} primitive Тип примитива
	*/
	startGeoDrawing: function(primitive) {
		var engine = this.getEngine();
		if (!engine) {
			return;
		}
		engine.startDrawing(primitive);
	},

/**
	* Смена цвета рисования
	* @color {String} цвет, на который меняем
	*/
	changeGeoDrawingColor: function(color) {
		var engine = this.getEngine();
		if (!engine) {
			return;
		}
		engine.changeDrawingColor(color);
	},

/**
	* Обработчик изменения основного слоя карты
	* @param {Object} layer Выбранный слой карты
	*/
	onSwitchLayer: function(layer) {
		if (!this.isLoaded() || !layer || !layer.name) {
			return;
		}
		Ext.state.Manager.getProvider().set('baselayerMapLayerName', layer.name);
	},

	/**
	 * Создает окно с информацией о SOS-сигнале
	 * @param {Object} data информация о сигнале
	 */
	drawSosBalloon: function(data) {
		var marker = this.addPacketPoint(data, 'sos_packet');
		// Sadly, we need this linking to properly destroy marker
		marker.packet.marker = marker;
	},

	/**
	 * Сформатировать данные для метки устройства
	 * @param {Object} device объект с информацией об устройстве из this.devices
	 * @param {Object} packet последний пакет
	 */
	getDeviceLabelData: function(device, packet) {
		var rows = [];
		var values = [];
		for (var i = 0; i < 3; i++) {
			var setting = C.getSetting('p.labelrow' + (i + 1));
			var cur_obj = null;
			//Поскольку у нас свойства делятся на свойства пакета и устройства,
			//то приходится определять, с каким объектом работать
			if (packet.device.isDeviceField(setting)) {
				rows[i] = packet.device.getFieldById(setting);
				cur_obj = packet.device;
			} else {
				rows[i] = packet.getFieldById(setting);
				cur_obj = packet;
			}

			values[i] = cur_obj[rows[i].field];
			if (rows[i].field == 'satellitescount') {
				if (values[i] > this.progressWidth.length - 1) {
					values[i] = this.progressWidth.length - 1;
				}
				values[i] = "<div class='gps-signal-info'>" +
					"<div class='gps-signal-meter' style='width: " +
					this.progressWidth[values[i]] +
					"px !important;'></div></div>";
			} else if (rows[i].field == 'speed') {
				values[i] = C.utils.fmtSpeed(cur_obj[rows[i].field]);
			} else if (rows[i].field == 'name') {
				values[i] = cur_obj.getName();
			} else if (rows[i].field == 'time') {
				values[i] = cur_obj.getTime();
			} else if (rows[i].field == 'odometer') {
				values[i] = C.utils.fmtOdometer(packet[rows[i].field]);
			} else if (rows[i].field == 'address') {
				values[i] = cur_obj[rows[i].field];
			} else {
				values[i] = packet[rows[i].field];
			}
		}
		return [
			{title: rows[0].name, value: values[0]},
			{title: rows[1].name, value: values[1]},
			{title: rows[2].name, value: values[2]}
		];
	}
});
