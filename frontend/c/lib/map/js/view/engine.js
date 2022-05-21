/**
 * @fileOverview Map monitoring engine
 */
/**
 * @class C.lib.map.Engine
 * @extends C.ui.Panel
 */
Ext.define('C.lib.map.Engine', {
	extend: 'C.ui.Panel',

/**
	* @constructs
	*/
	initComponent: function() {
		this.callParent(arguments);
		// Отрабатывать ли событие изменения масштаба карты
		this.zoomEventEnabled = true;
	},

	/**
	 * Determines if engine is loaded
	 * @return {Boolean}
	 */
	isLoaded: function() {
		return (!Ext.isEmpty(this.getMap()));
	},

	/**
	 * Возвращает координаты центра карты в формате {lat, lng}
	 * @returns Object
	 */
	getCenter: Ext.emptyFn,

	/**
	 * Возвращает масштаб карты
	 * @return Number
	 */
	getZoom: Ext.emptyFn,

/**
	* Подгоняем компонент карты движка по размерам к контейнеру.
	* Пустая функция для переопределения потомками
	* @protected
	*/
	checkResize: Ext.emptyFn,

/**
	* Функция установки координат центра карты
	* @param {Number} lat Широта
	* @param {Number} lng Долгота
	*/
	setCenter: Ext.emptyFn,

/**
	* Функция установки масштаба карты
	* @param {Number} zoom Масштаб
	*/
	setZoom: Ext.emptyFn,

	/**
	 * Возвращает массив точек фигуры, находящихся в редакторе
	 */
	getPointsArray: Ext.emptyFn,

/**
	* Возвращает маркер-стрелку
	* @param {int} alias
	* @param {string} color
	*/
	getMovementIcon: Ext.emptyFn,

/**
	* Создание линии
	* @param {Object[]} points Массив объектов координат
	* @param {Object} options Доп. настройки многоугольника
	* @return {Object}
	*/
	addLine: Ext.emptyFn,

/**
	* Перемещает карту так, чтобы было видно все точки
	* @param {O.mon.model.Packet[]} points - массив точек
	*/
	moveToPoints: Ext.emptyFn,

	/**
	 * Делает зум карты так, чтобы было видно все точки
	 * @param {O.mon.model.Packet[]} points - массив точек
	 * @param {Boolean} exactFit - поместить точно во viewport, чтобы зум не был избыточен
	 */
	zoomToPoints: Ext.emptyFn,

	/**
	 * Creates dummy entity
	 * @return {C.lib.map.openlayers.entity.abstract.Base}
	 */
	getDummy: Ext.emptyFn,

	/**
	 * Добавляет текстовую метку слева от точки
	 * @param {float} lat - долгота
	 * @param {float} lng - широта
	 * @param {string} text - текст метки (можно HTML)
	 * @param {function} callback - функция на клик
	 */
	addInscription: Ext.emptyFn,

	/**
	 * Добавляем html-метку на карту
	 * @param {float} lat - долгота
	 * @param {float} lng - широта
	 * @param {Object[]} rows - массив значений
	 * @param {Number} pos - положение относительно заданной точки
	 */
	addTextLabel: Ext.emptyFn,

	/**
	 * Добавление всплываюшего тултипа (появляется при наведении) к маркеру
	 * @param {C.lib.map.openlayers.entity.Marker} marker - Объект маркера
	 * @param {string} text - текст метки (можно HTML)
	 */
	addMarkerTooltip: Ext.emptyFn,

	/**
	 * Creates popup
	 * @param params
	 * @param show
	 * @return {C.lib.map.openlayers.entity.Popup}
	 */
	addPopup: Ext.emptyFn,

	/**
	 * Resets controls
	 */
	resetControls: Ext.emptyFn,

	/**
	 * Disable zoom event on activation of measurement control
	 */
	activateMeasurements: Ext.emptyFn,

	/**
	 * Enable zoom event on deactivation of measurement control
	 * Clear our popups
	 */
	deactivateMeasurements: Ext.emptyFn,

	/**
	 * Geocode coords and show popup there
	 */
	onCoordSelected: Ext.emptyFn,

	/**
	 * Добавление оверлея на карту
	 * @param {Object} overlay
	 * @abstract
	 */
	addOverlay: Ext.emptyFn,

	/**
	 * Убираем оверлей
	 * @param {Object} overlay
	 */
	removeOverlay: Ext.emptyFn,

	/**
	 * Добавление маркера на карту
	 * @param params
	 * @return {C.lib.map.openlayers.entity.Marker}
	 */
	addMarker: Ext.emptyFn,

	/**
	 * Добавляет на карту маркер-мигающую стрелку
	 * @param {float} lat - Широта
	 * @param {float} lng - Долгота
	 * @param {int} hide_delay - Задержка перед исчезанием стрелки, мс
	 */
	addArrow: Ext.emptyFn,

	/**
	 * Создание круга
	 * @param {float} lat - широта центра
	 * @param {float} lng - долгота центра
	 * @param {float} radius - радиус круга
	 * @param {object} style - стиль круга
	 */
	addRing: Ext.emptyFn,

	/**
	 * Draws Polygon from points array
	 * @param {OpenLayers.LonLat[]} points Coords array
	 * @param {Object} options Primitive options
	 * @return {C.lib.map.openlayers.entity.abstract.Geometry}
	 */
	addPolygon: Ext.emptyFn,

	/**
	 * Переключает карту в режим drag
	 */
	startDrag: Ext.emptyFn,

	/**
	 * Завершает режим drag
	 */
	endDrag: Ext.emptyFn,

	/**
	 * Places route point on map
	 * @param {float} latitude
	 * @param {float} longitude
	 * @param {string[]} name
	 * @param {object} style
	 */
	addRoutePoint: Ext.emptyFn,

	/**
	 * Draws path by points
	 * @param {float[][]} points
	 * @param {object} style
	 */
	drawRoute: Ext.emptyFn
});