/**
 * OpenLayers maps engine layer
 * @class C.lib.map.openlayers.Engine
 */

C.utils.inherit('C.lib.map.openlayers.Engine', {

/**
	* @construct
	*/
	initComponent: function() {
		this.callParent(arguments);
		this.initParameters();
	},

/**
	* Инициализируем параметры движка при загрузке
	*/
	renderMap: function() {

		this.lineLayer = null; //Container for vector features

		this.relayEvents(C.lib.map.openlayers.Extender, ['switchlayer']);
		C.lib.map.openlayers.Extender.recreate();

		this.addEvents('pointAdded', 'primitiveEdit', 'geocodeFinished');

		this.createMap(this.body.id);

		this.setZoom(4);
	},

/**
	* Creates control toolbar
	*/
	getControls: function() {
		var controls = [];
		var argParserControl = new OpenLayers.Control.ArgParser(),
			panZoomControl = new OpenLayers.Control.PanZoom(),
			attributionControl = new OpenLayers.Control.Attribution();

		var navControl = new OpenLayers.Control.Navigation({
			title: _('Drag map')
		});
		var controlsPanel = new OpenLayers.Control.Panel({
			defaultControl: navControl
		});

		var style = new OpenLayers.Style();
		var styleMap = new OpenLayers.StyleMap({
			"default": style
		});
		var measureControl = new OpenLayers.Control.Measure(OpenLayers.Handler.Path, {
			title: _('Measure distance'),
			persist: true,
			geodesic: true,
			handlerOptions: {
				layerOptions: {
					styleMap: styleMap
				}
			}
		});
		measureControl.events.on({
			activate: this.activateMeasurements,
			deactivate: this.deactivateMeasurements,
			measure: this.handleMeasurements,
			measurepartial: this.handleMeasurements,
			scope: this
		});
		var search = new OpenLayers.Control.SearchControl();
		search.events.on({
			textentered: this.doCoordSearch,
			scope: this
		});

		var geocodeControl = new OpenLayers.Control.GeocodeControl();
		geocodeControl.events.on({
			"pointselected": this.onCoordSelected,
			scope: this
		});

		controlsPanel.addControls([
			navControl,
			measureControl,
			search,
			geocodeControl,
			argParserControl,
			panZoomControl,
			attributionControl
		]);

		controls.push(controlsPanel);
		controls.push(new OpenLayers.Control.LayerPanel());

		return controls;
	},

/**
	* Handler of measurement events
	*/
	handleMeasurements: function(evt) {
		var geometry = evt.geometry;
		var units = _((evt.units == 'km') ? 'km' : 'm');
		var measure = Number(evt.measure).toFixed(2);
		var point = geometry.components[geometry.components.length - 1];
		var ll = this.getPoint(point.y, point.x, true);
		var l_rows = [{title: _('Distance'), value: measure + ' ' + units}];
		this.clearMeasurePopup();
		this.measureLabel = this.addTextLabel(ll.lat, ll.lon,
			l_rows, 2);
		this.measureLabel.show();
	},

/**
	* Выключение режима редактирования
	*/
	stopEditing: function() {
		this.stopDrawing();
		this.zoomEventEnabled = true;
	},

/**
	* Инициализация режима редактирования созданного ранее примитива
	* @param {Objcet} zone Объект геозоны
	*/
	startEditing: function(zone, primitive) {
		if (this.drawing) { return; }
		this.zoomEventEnabled = false;
		if (typeof(OpenLayers.Control.ModifyFeatureForCircle) === 'undefined') {
			C.lib.map.openlayers.Extender.recreate();
		}
		//Цвет геозоны
		this.drawingColor = '#' + zone.color;
		var drawFeatureOptions = {
			fillColor: this.drawingColor,
			fillOpacity: 0.4,
			strokeColor: this.drawingColor,
			strokeOpacity: 1
		};
		var engine = this;
		//Для круга нужно использовать отдельный Control для редактирования
		if (primitive == 'circle') {
			this.drawingLayer = new OpenLayers.Layer.Vector('Editing Layer', {
				renderers: this.openlayersRenderes
			});
			var points = [];
			//Формируем массив координат
			for (var i = 0; i < zone.coords.length; i++) {
				points.push(this.getPoint(zone.coords[i].latitude,
					zone.coords[i].longitude));
			}
			this.getMap().addLayer(this.drawingLayer);

			this.drawingControl = new OpenLayers.Control.ModifyFeatureForCircle(
				this.drawingLayer,
				{
					handlerOptions: {
						style:drawFeatureOptions
					}
				},
				this.getPoint(
					zone.center_lat,
					zone.center_lon
				),
				points
			);
			this.lastGeometry = null;
		} else {
			// Для остальных примитивов подключаем стандартный редактор
			// OpenLayers.Control.ModifyFeature
			this.addPolygon(zone.coords, drawFeatureOptions);
			this.drawingLayer = this.lineLayer;
			this.drawingControl = new OpenLayers.Control.ModifyControl(
				this.drawingLayer, drawFeatureOptions);
		}
		//Навешиваем обработчик события "примитив изменен"
		this.drawingControl.onModification = function() {
			engine.fireEvent('primitiveEdit');
		}
		//Добавляем контрол на карту и включаем его
		this.getMap().addControl(this.drawingControl);
		this.drawingControl.activate();
		//Для редактора круга поддерживается метод editMode
		if (this.drawingControl.editMode) {
			this.drawingControl.editMode();
		}
		//У стандартного редактора его нет, поэтому просто выбираем нарисованную
		//геозону
		if (this.lastGeometry) {
			this.drawingControl.selectFeature(this.lastGeometry.getFeature());
		}
		this.drawing = true;
		//Центрируем карту по границам примитива
		this.boundsApply(this.drawingControl.feature.geometry.getBounds());
	},

/**
	* Инициализируем рисование примитива
	* @param {String} primitive Тип примитива
	*/
	startDrawing: function(primitive) {
		if (typeof(OpenLayers.Control.ModifyFeatureForCircle) === 'undefined') {
			C.lib.map.openlayers.Extender.recreate();
		}
		this.zoomEventEnabled = false;
		this.pointsDrawn = 0;
		this.circleCenter = null;
		switch (primitive) {
			case 'track':
				this.minCurrentPrimitivePointsCount = this.MIN_TRACK_POINTS_COUNT;
				this.startDrawingTrack(this.drawingColor);
				break;
			case 'circle':
				this.minCurrentPrimitivePointsCount = this.MIN_CIRCLE_POINTS_COUNT;
				this.startDrawingCircle(this.drawingColor);
				break;
			default:
				this.minCurrentPrimitivePointsCount = this.MIN_POLYGON_POINTS_COUNT;
				this.startDrawingPolygon(this.drawingColor);
		}
	},

/**
	* Смена цвета рисования
	* @color {String} цвет, на который меняем
	*/
	changeDrawingColor: function(color) {
		//Устанавливаем цвет в текущем Control'е (если он это поддерживает)
		if (!this.drawingControl) {
			return;
		}
		if (this.drawingControl.setColor) {
			this.drawingControl.setColor('#' + color);
			this.drawingControl.handlerOptions.style.fillColor = '#' + color;
			this.drawingControl.handlerOptions.style.strokeColor = '#' + color;
		}
		this.drawingColor = color;
		//Устанавливаем цвет в слое
		if (this.drawingLayer.features.length > 0) {
			this.drawingLayer.features[0].style.fillColor = '#' + color;
			this.drawingLayer.features[0].style.strokeColor = '#' + color;
			this.drawingLayer.redraw();
		}
	},

/**
	* Выключает возможность рисования и удаляет все что было нарисовано
	*/
	stopDrawing: function() {
		if (!this.drawing) { return; }
		this.zoomEventEnabled = true;
		if (this.drawingLayer != this.lineLayer) {
			this.removeOverlay(this.drawingLayer);
		}
		else {
			this.lineLayer.removeAllFeatures();
		}
		this.drawingControl.deactivate();
		this.getMap().removeControl(this.drawingControl);
		delete this.drawingControl;
		delete this.drawingLayer;
		//Опять этот описанный ниже костыль, т.к. перестают выделяться маркеры
		//openlayers сразу после закрытия рисовалки
		if (this.markers != null) {
			this.markers.div.style.zIndex = this.MARKER_ZINDEX;
		}
		this.drawing = false;
	},

/**
	* ?
	* @param {?} color
	*/
	startDrawingCircle: function(color) {
		if (this.drawing) { return false; }
		this.drawingColor = color;
		this.pointsDrawn = 0;
		var layerId = Math.round(Math.random() * 30000);
		this.drawingLayer = new OpenLayers.Layer.Vector('Polygon Layer' + layerId, {
			renderers: this.openlayersRenderes
		});
		this.getMap().addLayer(this.drawingLayer);
		this.drawingLayer.div.style.zIndex = 10000;
		var drawFeatureOptions = {
			callbacks : {
				'point': Ext.bind(this.pointHandler, this)
			},
			handlerOptions: {
				style: {
					fillColor: '#' + this.drawingColor,
					fillOpacity: 0.4,
					strokeColor: '#' + this.drawingColor,
					strokeOpacity: 1
				}
			}
		};
		this.drawingControl = new OpenLayers.Control.DrawModifyFeatureForCircle(
			this.drawingLayer, OpenLayers.Handler.CustomRegularPolygon,
			drawFeatureOptions);
		this.drawingControl.setColor(this.drawingColor);
		this.getMap().addControl(this.drawingControl);
		this.drawingControl.activate();
		this.drawing = true;
	},

/**
	* Активирует возможность рисования трека - ломаной
	* @param {?} color
	*/
	startDrawingTrack: function(color) {
		if (this.drawing) { return false; }
		this.drawingColor = color;
		this.pointsDrawn = 0;
		var layerId = Math.round(Math.random() * 30000);
		this.drawingLayer = new OpenLayers.Layer.Vector('Polygon Layer' + layerId, {
			renderers: this.openlayersRenderes
		});
		this.getMap().addLayer(this.drawingLayer);
		this.drawingLayer.div.style.zIndex = 10000;
		var drawFeatureOptions = {
			callbacks : {
				'point': Ext.bind(this.pointHandler, this)
			},
			handlerOptions: {
				style: {
					fillColor: '#' + this.drawingColor,
					fillOpacity: 0.4,
					strokeColor: '#' + this.drawingColor,
					strokeOpacity: 1
				}
			}
		};
		this.drawingControl = new OpenLayers.Control.DrawModifyFeature(
			this.drawingLayer, OpenLayers.Handler.CustomPath, drawFeatureOptions);
		this.drawingControl.setColor(this.drawingColor);
		this.getMap().addControl(this.drawingControl);
		this.drawingControl.activate();
		this.drawing = true;
	},

/**
	* Активирует возможность рисования полигона
	* @param {?} color
	*/
	startDrawingPolygon: function(color) {
		if (this.drawing) { return false; }
		this.drawingColor = color;
		this.pointsDrawn = 0;
		var layerId = Math.round(Math.random() * 30000);
		this.drawingLayer = new OpenLayers.Layer.Vector('Polygon Layer' + layerId, {
			renderers: this.openlayersRenderes
		});
		this.getMap().addLayer(this.drawingLayer);
		this.drawingLayer.div.style.zIndex = 10000;
		var drawFeatureOptions = {
			callbacks : {
				'point': Ext.bind(this.pointHandler, this)
			},
			handlerOptions: {
				style: {
					fillColor: '#' + this.drawingColor,
					fillOpacity: 0.4,
					strokeColor: '#' + this.drawingColor,
					strokeOpacity: 1
				}
			}
		};
		this.drawingControl = new OpenLayers.Control.DrawModifyFeature(
			this.drawingLayer, OpenLayers.Handler.CustomPolygon, drawFeatureOptions);
		this.drawingControl.setColor('#' + this.drawingColor);
		this.getMap().addControl(this.drawingControl);
		this.drawingControl.activate();
		this.drawing = true;
	},

/**
	* Checks, if stoppings must be merged into one
	* @param {O.mon.trackhistory.TrackModel} first
	* @param {O.mon.trackhistory.TrackModel} second
	* @return {Boolean}
	*/
	stoppingsNeedMerge: function(first, second) {
		if (!first.lonlat) {
			first.lonlat = new OpenLayers.LonLat(first.longitude, first.latitude);
		}
		if (!second.lonlat) {
			second.lonlat = new OpenLayers.LonLat(second.longitude, second.latitude);
		}

		var distance = OpenLayers.Util.distVincenty(first.lonlat, second.lonlat);
		return (distance * 1000 < first.radius + second.radius);
	}
});
