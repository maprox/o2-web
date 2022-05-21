/**
 * @class C.lib.map.openlayers.Engine
 * @extends Ext.Base
 */
Ext.define('C.lib.map.openlayers.Engine', {
	extend: 'C.lib.map.Engine',

	/**
	 * @event cleared
	 * Fires whenever map is cleared
	 */

	mixins: ['C.lib.map.openlayers.Util'],

	config: {
		/**
		 * @cfg {Object} map
		 * Map object.
		 * @accessor
		 */
		map: null
	},

/*
	* Минимальное количество точек для создания примитивов
	*/
	MIN_POLYGON_POINTS_COUNT: 3,
	MIN_TRACK_POINTS_COUNT: 2,
	MIN_CIRCLE_POINTS_COUNT: 1,

/*
	* Z-index для отдельных составляющих карты - обеспечивает порядок их
	* отображения на карте
	*/
	MARKER_ZINDEX: 30000,
	INSCRIPTION_ZINDEX: 45000,

/**
 * Массив типов рендереров для OpenLayers. Используется первый поддерживаемый.
 * "Canvas", "SVG2", "SVG", "VML", "NL"
 */
	openlayersRenderes: ["SVG", "SVG2", "VML"],

/**
	* @construct
	*/
	initParameters: function() {
		/*
		 * Маркер-указатель (показывает на выбранные точки трека)
		 */
		this.arrowMarker = null;

		/*
		* Признак того, что карта находится в режиме рисования
		*/
		this.drawing = false;

		/*
		* Цвет для рисования
		*/
		this.drawingColor = 'ff6600';
		/*
		* Минимальное количество точек для создания текущего примитива
		*/
		this.minCurrentPrimitivePointsCount = 0;

		/**
		* Центр круга
		*/
		this.circleCenter = null;

		/**
		* Последний добавленный на карту примитив
		*/
		this.lastGeometry = null;

		/*
		* Здесь сохраняется количество точек, поставленных с момента начала рисования
		*/
		this.pointsDrawn = 0;

		/*
		 * Контрол для рисования и редактирования
		 */
		this.drawingControl = null;

		/*
		 * Слой для попапов
		 */
		this.markersLayer = null;

		this.on({
			showlayerswitcher: 'showLayerSwitcher',
			scope: this
		});
	},

/**
	* Returns marker layer
	*/
	getMarkerLayer: function() {
		if (this.markersLayer == null) {
			this.markersLayer = new OpenLayers.Layer.Markers(
				"marker" + OpenLayers.Util.createUniqueID, {
					displayInLayerSwitcher: false,
					alwaysInRange: true
				});
			this.getMap().addLayer(this.markersLayer);
			//this.markersLayer.div.style.zIndex = this.MARKER_ZINDEX;
		}

		return this.markersLayer;
	},

	/**
	 * Returns route layer
	 */
	getRouteLayer: function() {
		if (!this.getMap()) { return null; }
		if (this.routeLayer == null) {
			this.routeLayer = new OpenLayers.Layer.Vector("route_layer", {
				displayInLayerSwitcher: false,
				alwaysInRange: true,
				rendererOptions: {
					zIndexing: true
				}
			});
			this.getMap().addLayer(this.routeLayer);
		}

		return this.routeLayer;
	},

	/**
	 * Creates layer for drawing vector feature
	 */
	createVectorLayer: function() {
		if (this.lineLayer) { return; }
		var map = this.getMap();
		this.lineLayer = new OpenLayers.Layer.Vector("Line Layer", {
			displayInLayerSwitcher: false,
			renderers: this.openlayersRenderes,
			rendererOptions: {zIndexing: true}
		});

		map.addLayer(this.lineLayer);

		map.events.register('click', this, function(e) {
			if (e && e.target) {
				this.fireEvent('geometry_clicked', e.target.id);
			}
		});
	},

/**
	* Создает карту в html-элементе с айдишником айди
	* @param {Number} id
	*/
	createMap: function(id) {
		OpenLayers.ImgPath = C.cfg.maps.settings.imgPath;

		this.setMap(new OpenLayers.Map(id, {
			projection: "EPSG:900913",
			displayProjection: "EPSG:900913",
			units: "m",
			maxResolution: 156543.0339,
			maxExtent: new OpenLayers.Bounds(
				-20037508,
				-20037508,
				20037508,
				20037508.34
			),
			panMethod: C.cfg.maps.settings.animatedPan,
			controls: this.getControls(),
			/*
			 * Создаем в карте ссылку на движок, т.к. в обработчиках событий
			 * OpenLayers иначе получить к нему доступ невозможно
			 */
			observerEngine: this
		}));

		this.initMapLayers();
		this.initMapEvents();
	},

/**
	* Layers initialization
	*/
	initMapLayers: function() {

		// OSM
		// ----------------------------------------------

		// OSM tile url
		var osmTileUrl = null;
		if (C.cfg.maps.osm.enableTileUrl) {
			osmTileUrl = C.cfg.maps.osm.tileUrl || null;
		}

		var layers = [];
		layers.push(new OpenLayers.Layer.OSM(
			_("OpenStreetMap"),
			osmTileUrl,
			{
				name: _('OpenStreetMap'),
				transitionEffect: 'resize'
			}
		));

		// Yandex
		// ----------------------------------------------
		if (C.utils.isset('OpenLayers.Layer.Yandex')/* &&
			C.utils.isset('ymaps.mapType')*/) {
			layers.push(new OpenLayers.Layer.Yandex(
				_("Yandex Maps"), {
					name: _("Yandex Maps"),
					sphericalMercator: true,
					mapType: 'yandex#map'
			}));

			layers.push(new OpenLayers.Layer.Yandex(
				_("Yandex Social"), {
					name: _("Yandex Social"),
					sphericalMercator: true,
					mapType: 'yandex#publicMap'
			}));

			layers.push(new OpenLayers.Layer.Yandex(
				_("Yandex Satellite"), {
					name: _("Yandex Satellite"),
					sphericalMercator: true,
					mapType: 'yandex#satellite'
			}));

			layers.push(new OpenLayers.Layer.Yandex(
				_("Yandex Hybrid"), {
					name: _("Yandex Hybrid"),
					sphericalMercator: true,
					mapType: 'yandex#hybrid'
			}));

		}

		// Bing
		// ----------------------------------------------
		if (C.utils.isset('OpenLayers.Layer.Bing')
			&& location.protocol != 'https:'
		) {
			layers.push(new OpenLayers.Layer.Bing({
				name: _('Bing Road'),
				key: C.cfg.maps.bing.apiKey,
				type: "Road",
				metadataParams: {mapVersion: "v1"}
			}));

			layers.push(new OpenLayers.Layer.Bing({
				name: _('Bing Aerial'),
				key: C.cfg.maps.bing.apiKey,
				type: "Aerial"
			}));

		}

		// Google
		// ----------------------------------------------
		if (C.utils.isset('OpenLayers.Layer.Google') &&
			C.utils.isset('google.maps.MapTypeId')) {

			layers.push(new OpenLayers.Layer.Google(
				_("Google Streets"), {
					numZoomLevels: 20
			}));

			layers.push(new OpenLayers.Layer.Google(
				_("Google Satellite"), {
					type: google.maps.MapTypeId.SATELLITE,
					numZoomLevels: 22
			}));

			layers.push(new OpenLayers.Layer.Google(
				_("Google Hybrid"), {
					type: google.maps.MapTypeId.HYBRID,
					numZoomLevels: 20
			}));

			layers.push(new OpenLayers.Layer.Google(
				_("Google Physical"), {
					type: google.maps.MapTypeId.TERRAIN
			}));
		}

		var map = this.getMap();
		map.addLayers(layers);
		map.setBaseLayer(layers[0]);
	},

/**
	* Map events initialization
	* @private
	*/
	initMapEvents: function() {
		//this.addEvents('moveend', 'zoomend');
		var map = this.getMap();
		if (!map) { return; }
		// register zoomend event
		map.events.register('zoomend', map,
			Ext.bind(function() {
				if (this.zoomEventEnabled) {
					this.fireEvent('zoomend', this)
				}
			}, this, [this]));
		// register moveend event
		map.events.register('moveend', map,
			Ext.bind(function() {
				this.fireEvent('moveend', map);
			}, this, [map]));
	},

	/**
	 * Creates new entity
	 * @protected
	 * @param type
	 * @param params
	 * @return {C.lib.map.openlayers.entity.abstract.Base}
	 */
	addEntity: function(type, params) {
		params = params || {};

		var cls = 'C.lib.map.openlayers.entity.' + type;

		// Костыль. См. коммент ниже.
		var layer = params.layer;
		delete params.layer;

		var entity = Ext.create(cls, params);
		// Can't add map or layer beforehand - in Sencha Touch circular Ext.clone would be evoked, and call stack will be exceeded
		// http://www.sencha.com/forum/showthread.php?155692-Ext.clone-should-check-for-a-custom-clone()-_clone()-or-another-suitable-method
		// Remove when fixed in Sencha Touch
		entity.setMap(this.getMap());
		if (layer) {
			entity.setLayer(layer);
		}
		return entity;
	},

	/**
	 * Creates dummy entity
	 * @return {C.lib.map.openlayers.entity.abstract.Base}
	 */
	getDummy: function() {
		return this.addEntity('Dummy');
	},

	/**
	 * Draws geometry from points array
	 * @protected
	 * @param {String} type
	 * @param params
	 * @return {C.lib.map.openlayers.entity.abstract.Geometry}
	 */
	addGeometry: function(type, params) {
		//create layer if not exists
		this.createVectorLayer();

		var geometry = this.addEntity(type, Ext.apply({
			layer: this.lineLayer
		}, params));

		this.lastGeometry = geometry;

		return geometry;
	},

/**
	* Добавляет текстовую метку слева от точки
	* @param {float} lat - долгота
	* @param {float} lng - широта
	* @param {string} text - текст метки (можно HTML)
    * @param {function} callback - функция на клик
	*/
	addInscription: function(lat, lng, text, callback) {
		var popup = this.addPopup({
			longitude: lng,
			latitude: lat,
			content: '<nobr>' + text + '</nobr>',
			position: 'right',
			ppClass: 'label',
			zindex: this.INSCRIPTION_ZINDEX
		}, true);

		if (callback) {
			var target = popup.getFeature().popup;
			target.events.register('click', target, function(evt){
				callback.call(this, evt, this.contentDiv);
				this.updateSize();
			}, true);
		}

		return popup;
	},

/**
	* Добавляем html-метку на карту
	* @param {float} lat - долгота
	* @param {float} lng - широта
	* @param {Object[]} rows - массив значений
	* @param {Number} pos - положение относительно заданной точки
	*/
	addTextLabel: function(lat, lng, rows, pos) {
		var samplePopupContentsHTML = "<table class='device_descr'>";
		for (var i = 0; i < rows.length; i++) {
			var r_num = i + 1;
			if (rows[i].title !== undefined && rows[i].value !== undefined) {
				samplePopupContentsHTML +=
					"<tr><td class='device_descr_row" + r_num + "'><nobr>" +
					String(rows[i].title).replace(' ', '&nbsp;') +
					"</nobr></td><td><nobr>" +
					rows[i].value + "</nobr></td></tr>";
			}
		}
		samplePopupContentsHTML += "</table>";

		var position = 'left';
		switch (pos) {
			case 2: position = 'right'; break;
			case 3: position = 'top'; break;
			case 4: position = 'bottom'; break;
		}

		return this.addPopup({
			longitude: lng,
			latitude: lat,
			content: samplePopupContentsHTML,
			position: position
		});
	},

/**
	* Добавление всплываюшего тултипа (появляется при наведении) к маркеру
	* @param {C.lib.map.openlayers.entity.Marker} marker - Объект маркера
	* @param {string} text - текст метки (можно HTML)
	*/
	addMarkerTooltip: function(marker, text) {
		var popup = this.addPopup({
			lonLat: marker.getLonLat(),
			content: text,
			position: 'top',
			ppClass: 'tooltip',
			cssClass: 'olIconTooltip',
			cssHeight: '24px'
		});

		// @todo Внутрь класса маркера
		var target = marker.getMarker();
		target.events.register("mouseout", target, Ext.bind(function(evt) {
			popup.hide();
			return false;
		}, this, [marker]));
		target.events.register("mouseover", target,	Ext.bind(function(evt) {
			popup.show();
			return false;
		}, this, [marker]));
		return popup;
	},

	/**
	 * Creates popup
	 * @param params
	 * @param show
	 * @return {C.lib.map.openlayers.entity.Popup}
	 */
	addPopup: function(params, show) {
		var popup = this.addEntity('Popup', params);

		if (show) {
			popup.show();
		} else {
			popup.create();
		}

		return popup;
	},

/**
	* Resets controls
	*/
	resetControls: function() {
		var controls = this.getMap().getControlsByClass('OpenLayers.Control.Panel');
		if (!controls.length) { return; }

		var panel = controls[0];
		panel.activateControl(panel.defaultControl);
	},

/**
	* Disable zoom event on activation of measurement control
	*/
	activateMeasurements: function() {
		this.zoomEventEnabled = false;
	},

/**
	* Enable zoom event on deactivation of measurement control
	* Clear our popups
	*/
	deactivateMeasurements: function() {
		this.clearMeasurePopup();
		this.zoomEventEnabled = true;
	},

/**
	* Shows popup with geocoding results
	* @param {float} lat Latitude
	* @param {float} lng Longitude
	* @param {string} addr Address string
	*/
	showGeocodePopup: function(lat, lng, addr) {
		this.fireEvent('geocodeFinished', {
			latitude: lat,
			longitude: lng,
			addr: addr
		});
	},

/**
	* Geocode coords and show popup there
	*/
	onCoordSelected: function(coord) {
		this.showGeocodePopup(
			coord.click_latitude,
			coord.click_longitude,
			coord.address
		);
		this.resetControls();
	},

/**
	* Search for coords by address and center map there
	*/
	doCoordSearch: function(evt) {
		var input = this.formatCoordText(evt.text);

		C.lib.map.Helper.getGeocoder().geocode(input, {
			success: function(data) {
				var lat = input.lat || data.latitude,
					lon = input.lng || data.longitude,
					address = data.address || _('not found');

				if (lat && lon) {
					this.showGeocodePopup(lat, lon, address);
					this.setCenter(lat, lon, false);
				}
			},
			scope: this
		});
	},

/**
	* Formats coord control text string to geocode params
	* @param {String} text
	* @returns Object
	* @private
	*/
	formatCoordText: function(text) {
		if (coords = text.match(/^\s*(\d+(?:\.\d+)?)[,;]?\s+(\d+(?:\.\d+)?)\s*$/i)) {
			return {lat: coords[1], lng: coords[2]};
		}

		return {address: text};
	},

/**
	* Removes popup with measure results
	*/
	clearMeasurePopup: function() {
		if (this.measureLabel) {
			this.measureLabel.destroy();
		}
	},

/**
	* Возвращает массив точек фигуры, находящихся в редакторе
	*/
	getPointsArray: function() {
		if (!this.drawingControl) { return {}; }
		var geometry = this.drawingControl.getPoints();
		var resultArray = [];
		var pArr = [];
		for (var i = 0; i < geometry.length; i++) {
			var result = (this.convertPoint(
				geometry[i].geometry.y,
				geometry[i].geometry.x
			));
			resultArray.push({latitude: result.lat, longitude: result.lng});
			pArr.push(new OpenLayers.Geometry.Point(result.lng, result.lat));
		}

		var center = (new OpenLayers.Geometry.LinearRing(pArr).getCentroid());

		return {
			coords: resultArray,
			centerLat: center ? center.y : 0,
			centerLon: center ? center.x : 0
		};
	},

/**
	* Считаем количество точек, проставленных с момента начала рисования
	* и вызывает событие, в обработчик которого передаем массив точек
	*/
	pointHandler: function() {
		this.pointsDrawn++;
		if (Math.round(this.pointsDrawn / 2) <
			this.minCurrentPrimitivePointsCount) {
			return;
		}
		//получаем массив точек
		this.fireEvent('pointAdded', this.getPointsArray());
	},

/**
	* Преобразовываем координаты из формата OSM в градусы широты и долготы
	*/
	convertPoint: function(lat, lng) {
		var point = new OpenLayers.LonLat(lng, lat).transform(
			this.getMap().getProjectionObject(),
			new OpenLayers.Projection("EPSG:4326"));
		return {
			lat: point.lat,
			lng: point.lon
		}
	},

/**
	* Функция установки масштаба карты
	* @param {Number} zoom Масштаб
	*/
	setZoom: function(zoom) {
		var map = this.getMap();
		if (!map) { return; }
		map.zoomTo(zoom);
	},

/**
	* Возвращает масштаб карты
	* @return Number
	*/
	getZoom: function() {
		var map = this.getMap();
		if (!map) { return null; }
		return map.getZoom();
	},

/**
	* Добавление оверлея на карту
	* @param {Object} overlay
	* @abstract
	*/
	addOverlay: function(overlay) {
		if (typeof(overlay) !== "undefined") {
			this.getMap().addLayer(overlay);
		}
	},

/**
	* Убираем оверлей
	* @param {Object} overlay
	*/
	removeOverlay: function(overlay) {
		if (typeof(overlay) !== "undefined") {
			this.getMap().removeLayer(overlay);
		}
	},

/**
	* Подгоняем компонент карты движка по размерам к контейнеру
	* @protected
	*/
	checkResize: function() {
		if (!this.isLoaded()) {return;}
		this.getMap().updateSize();
	},

/**
	* Возвращает координаты центра карты
	* @returns Object
	*/
	getCenter: function() {
		if (!this.isLoaded()) {return null;}
		var map = this.getMap();
		var center = map.getCenter().transform(
			map.getProjectionObject(),
			new OpenLayers.Projection("EPSG:4326"));
		return {
			lat: center.lat,
			lng: center.lon
		}
	},

	/**
	 * Добавление маркера на карту
	 * @param params
	 * @return {C.lib.map.openlayers.entity.Marker}
	 */
	addMarker: function(params, show) {
		show = (show === undefined) ? true : show;
		params.layer = this.getMarkerLayer();
		params.launcher = this;
		var marker = this.addEntity('Marker', params);
		if (show) {
			marker.show();
		}

		return marker;
	},

	/**
	 * Adds sensor marker
	 * @param params
	 */
	addSensorMarker: function(params) {

		var options = Ext.clone(Ext.apply(params.style, {
			//pointRadius: 5
		}));

		var point = this.addEntity('StyledPoint', {
			layer: this.lineLayer,
			latitude: params.latitude,
			longitude: params.longitude,
			options: options
		});

		point.show();

		return point;
	},

/**
	* Убирает с карты марке-мигающую стрелку
	* @param {Object} arrow Объект с информацией о маркере
	*/
	removeArrow: function(arrow) {
		if (arrow != null) {
			arrow.destroy();
		}
	},

/**
	* Добавляет на карту маркер-мигающую стрелку
	* @param {float} lat - Широта
	* @param {float} lng - Долгота
	* @param {int} hide_delay - Задержка перед исчезанием стрелки, мс
	*/
	addArrow: function(lat, lng, hide_delay) {
		var delay = 2000 || hide_delay;
		if (this.arrowMarker != null) {
			this.removeArrow(this.arrowMarker);
		}
		this.arrowMarker = this.addMarker({
			latitude: lat,
			longitude: lng,
			img: 'arrow_blink'
		});
		Ext.Function.defer(this.removeArrow, delay, this, [this.arrowMarker]);
	},

	/**
	 * Создание OpenLayers.Geometry.LinearRing заданной ширины
	 * @param {float} lat - широта центра
	 * @param {float} lng - долгота центра
	 * @param {float} radius - радиус круга
	 * @param {Object} style
	 * @return {C.lib.map.openlayers.entity.abstract.Geometry}
	 */
	addRing: function(lat, lng, radius, style) {
		var geometry = this.addGeometry('Ring', {
			latitude: lat,
			longitude: lng,
			radius: radius,
			options: style
		});

		geometry.show();

		this.lastGeometry = geometry;

		return geometry;
	},

/**
	* Draws line from points array
	* @param {OpenLayers.LonLat[]} points Coords array
	* @param {Object} options Primitive options
	* @return {C.lib.map.openlayers.entity.abstract.Geometry}
	*/
	addLine: function(points, options) {
		return this.addGeometry('Line', {points: points, options: options});
	},

	/**
	 * Возвращает маркер-стрелку
	 * @param {int} alias
	 * @param {string} color
	 */
	getMovementIcon: function(alias, color) {
		return C.lib.map.openlayers.Images.getMovementIcon(alias, color);
	},

	/**
	 * Draws Polygon from points array
	 * @param {OpenLayers.LonLat[]} points Coords array
	 * @param {Object} options Primitive options
	 * @return {C.lib.map.openlayers.entity.abstract.Geometry}
	 */
	addPolygon: function(points, options) {
		var geometry = this.addGeometry('Polygon', {
			points: points,
			options: options
		});

		geometry.show();
		return geometry;
	},

/**
	* Создает объект прямоугольной области
	* @return {Object}
	*/
	boundsAllocate: function() {
		return new OpenLayers.Bounds();
	},

/**
	* Расширение прямоугольной области bounds
	* для вмещения в себя координаты lat и lng
	* @param {Number} lat Широта
	* @param {Number} lng Долгота
	* @param {Object} bounds Объект прямоугольной области
	*/
	boundsExtend: function(lat, lng, bounds) {
		bounds.extend(new OpenLayers.LonLat( lng, lat ).transform(
			new OpenLayers.Projection("EPSG:4326"),
			this.getMap().getProjectionObject()
		));
	},

/**
	* Применение прямоугольной области к окну карты
	* @param {Object} bounds
	*/
	boundsApply: function(bounds, scale) {
		if (bounds.getCenterLonLat().toShortString() !== "0, 0") {
			scale = (scale === undefined) ? false : scale;
			this.getMap().zoomToExtent(bounds, scale);
		}
	},

/*
	* Возвращает границы окна карты
	* @return {OpenLayers.Bounds}
	*/
	getBounds: function() {
		return this.getMap().getExtent();
	},

	/**
	 * Перемещает карту так, чтобы было видно все точки
	 * @param {O.mon.model.Packet[]} points - массив точек
	 */
	moveToPoints: function(points) {
		var bounds = this.boundsAllocate();
		for (var i = 0; i < points.length; i++) {
			var point = points[i];
			this.boundsExtend(point.latitude, point.longitude, bounds);
		}
		this.panToBounds(bounds);
		return bounds;
	},

	/**
	 * Делает зум карты так, чтобы было видно все точки
	 * @param {O.mon.model.Packet[]} points - массив точек
	 * @param {Boolean} exactFit - поместить точно во viewport, чтобы зум не был избыточен
	 */
	zoomToPoints: function(points, exactFit) {
		var bounds = this.moveToPoints(points);

		if (exactFit) {
			this.boundsApply(bounds, true);
			return;
		}

		for (var i = 0; i < points.length; i++) {
			var point = points[i];
			if (!this.containsCoord(point.latitude, point.longitude)) {
				this.boundsApply(bounds);
				return false;
			}
		}
	},

/*
	* Проверка, содержит ли видимая область карты заданную точку
	* @param {float} latitude широта
	* @param {float} longitude долгота
	* @return {Bool}
	*/
	containsCoord: function(latitude, longitude) {
		var bounds = this.getBounds();
		return bounds.containsLonLat(this.getPoint(latitude, longitude), true);
	},

/**
	* Функция установки координат центра карты
	* @param {Number} lat Широта
	* @param {Number} lng Долгота
	* @param {Boolean} defZoom - Установка масштаба по умолчанию (true)
	*/
	setCenter: function(lat, lng, defZoom) {
		if (!this.isLoaded()) {return;}
		defZoom = (defZoom === undefined) ? true : defZoom;
		if (typeof lat == 'object' && lat.lat && lat.lng) {
			lng = lat.lng;
			lat = lat.lat;
		}
		if (defZoom) {
			this.getMap().setCenter(new OpenLayers.LonLat(lng, lat).transform(
					new OpenLayers.Projection("EPSG:4326"),
					this.getMap().getProjectionObject()
				), 12);
		} else {
			this.getMap().panTo(this.getPoint(lat, lng));
			if (Ext.isOpera) {
				this.fixOpera();
			}
		}
	},

/**
	* Set map center to selected bounds
	* @param {Object} bounds
	*/
	panToBounds: function(bounds) {
		var center = bounds.getCenterLonLat();
		if (center.lat == 0 || center.lon == 0) return;
		this.getMap().panTo(bounds.getCenterLonLat());
		if (Ext.isOpera) {
			this.fixOpera();
		}
	},

/**
	* Show layer switcher window
	* Creates it if not yet created.
	*/
	showLayerSwitcher: function() {
		if (!this.layerswitcher) {
			this.layerswitcher = new Ext.widget('layerlist');
			this.relayEvents(this.layerswitcher, [
				'layerswitched'
			]);
			this.layerswitcher.setMap(this.getMap());
		}

		if (this.layerswitcher.isListDisplayed()) {
			this.layerswitcher.hideList();
		} else {
			this.layerswitcher.displayList(this);
		}
	},

	getLayer: function() {
		return this.getMap().baseLayer.name;
	},

	setLayer: function(value) {
		var map = this.getMap(),
			layers = map.layers;
		for (var i = 0, l = layers.length; i < l; i++) {
			if (layers[i].name == value) {
				map.setBaseLayer(layers[i]);
			}
		}
	},

/**
	* Переключает карту в режим drag
	*/
	startDrag: function() {
		this.endDrag();

		var control = new OpenLayers.Control.DragMarker(
			this.getMarkerLayer(), {
				onComplete: Ext.bind(this.onDragComplete, this)
			}
		);

		this.getMap().addControl(control);

		control.activate();
	},

/**
	* Завершает режим drag
	*/
	endDrag: function() {
		var controls = this.getMap().getControlsByClass('OpenLayers.Control.DragMarker');
		if (!controls.length) { return; }

		for (var i = 0; i < controls.length; i++) {
			var control = controls[i];
			this.getMap().removeControl(control);
			control.destroy();
		}
	},

/**
	* Обработчик окончания drag-а
	*/
	onDragComplete: function(marker) {
		var point = this.convertPoint(marker.lonlat.lat, marker.lonlat.lon);
		this.fireEvent('warehouse_moved', point.lat, point.lng);
	},

	/**
	 * Places route point on map
	 * @param {float} latitude
	 * @param {float} longitude
	 * @param {string[]} name
	 * @param {object} style
	 */
	addRoutePoint: function(latitude, longitude, name, style) {
		var options = Ext.clone(Ext.apply(style, {
			label: name.join(', '),
			pointRadius: 5 * (name.length + 1)
		}));

		var point = this.addEntity('StyledPoint', {
			layer: this.getRouteLayer(),
			latitude: latitude,
			longitude: longitude,
			options: options
		});
		point.show();
		return point;
	},

	/**
	 * Draws path by points
	 * @param {float[][]} points
	 * @param {object} style
	 */
	drawRoute: function(points, style) {
		var draw = [];
		for (var i = 0; i < points.length; i++) {
			draw.push({longitude: points[i][1], latitude: points[i][0]});
		}
		var route = this.addEntity('Line', {
			layer: this.getRouteLayer(),
			points: draw,
			options: style
		});
		route.show();
		return route;
	},

/**
	* Fixes opera positioining problem
	*/
	fixOpera: function() {
		this.suspendEvents(false);
		this.getMap().zoomIn();
		this.getMap().zoomOut();
		this.resumeEvents();
	}

});
