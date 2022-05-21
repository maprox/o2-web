/**
 * Base layer class for map engine
 * ===============================
 *
 * Description goes here
 *
 * @class C.lib.map.Baselayer
 * @extends C.ui.Panel
 */

Ext.define('C.lib.map.Baselayer', {
	extend: 'C.ui.Panel',
	alias: 'widget.baselayer',

/** CONFIG */
	config: {
		/**
		 * Layout
		 */
		layout: 'fit',

		/**
		 * @cfg {String} baseCls
		 * The base CSS class to apply to the Maps's element
		 * @accessor
		 */
		baseCls: Ext.baseCSSPrefix + 'baselayer',

		/**
		 * @cfg {O.map.Engine} engine
		 * The wrapped map engine.
		 * @accessor
		 */
		engine: null
	},

	/**
	 * @cfg {Number} _INITIAL_LAT
	 * Default starting latitude
	 */
	_INITIAL_LAT: 53.1987,

	/**
	 * @cfg {Number} _INITIAL_LON
	 * Default starting longitude
	 */
	_INITIAL_LON: 50.2406,

	/**
	 * @cfg {Number} _INITIAL_ZOOM
	 * Default starting zoom
	 */
	_INITIAL_ZOOM: 14,

/**
	* Состояние карты
	* @type {Object}
	*/
	mapState: null,

/**
	* Inits class parameters
	*/
	initParameters: function() {
		this.infoBaloon = null;
		this.mapState = this.getInitialMapState();

		this.trackingSettings = {    // Параметры слежения по умолчанию
			selectedTracking: false,
			showLastPoints: true,
			showDeviceLabels: false
		};

		this.initTemplates();

		Ext.Object.each(this.mixins, function(key, mixin){
			if (mixin.onAfterInit) {
				mixin.onAfterInit.call(this);
			}
		}, this);
	},

	initTemplates: function() {
		this.lngTemplateGeocode = '<table>' +
			'<tr><td><b>' + _('Address') +
				':</b></td><td>{0}</td></tr>' +
			'<tr><td><b>' + _('Coordinates') +
				':</b></td><td>{1}; {2}</td></tr>' +
			'</table>';

		Ext.Object.each(this.mixins, function(key, mixin){
			if (mixin.onInitTemplates) {
				mixin.onInitTemplates.call(this);
			}
		}, this);
	},

/**
	* Метод, возвращающий стартовое положение на карте
	* @returns {Object}
	* @protected
	*/
	getInitialMapState: function() {
		return {
			center: {
				lat: this._INITIAL_LAT,
				lng: this._INITIAL_LON
			},
			zoom: this._INITIAL_ZOOM
		};
	},

/**
	 * Центрирует карту на указанных координатах
	 * @param {float} lat - Широта
	 * @param {float} lng - Долгота
	 */
	setCenter: function(lat, lng) {
		if (!this.isLoaded()) { return; }
		//Центрируем не меняя масштаба
		this.getEngine().setCenter(lat, lng, false);
	},

	/**
	 * Показывает маркер-стрелку
	 * @param {float} lat - Широта
	 * @param {float} lng - Долгота
	 */
	showArrow: function(lat, lng) {
		if (!this.isLoaded()) { return; }
		//Центрируем не меняя масштаба
		this.setCenter(lat, lng);
		this.getEngine().addArrow(lat, lng);
	},

/**
	* Creates arrowed baloon
	* @param {String} html Data
	* @param {Number} latitude
	* @param {Number} longitude
	* @param {Function|null} click onClick handler
	* @param {Object|null} clickData onClick handler additional data
	*/
	showBaloon: function(html, latitude, longitude, click, clickData) {
		if (!this.isLoaded()) { return; }

		this.clearBaloon();

		var baloon = this.getEngine().addPopup({
			longitude: longitude,
			latitude: latitude,
			content: html,
			position: 'right',
			ppClass: 'framedCloud',
			closeBox: true
		}, true);

		if (click) {
			baloon.addClickListener(click, this, clickData);
		}

		this.infoBaloon = baloon;
	},

	/**
	 * Removes arrowed baloon
	 */
	clearBaloon: function() {
		if (this.infoBaloon) {
			this.infoBaloon.destroy();
			this.infoBaloon = null;
		}
	},

	/**
	 * Перемещает карту так, чтобы было видно все точки
	 * @param {O.mon.model.Packet[]} points - массив точек
	 */
	moveToPoints: function(points) {
		if (!this.isLoaded()) { return; }
		this.getEngine().moveToPoints(points);
	},

	/**
	 * Делает зум карты так, чтобы было видно все точки
	 * @param {O.mon.model.Packet[]} points - массив точек
	 * @param {Boolean} exactFit - поместить точно во viewport, чтобы зум не был избыточен
	 */
	zoomToPoints: function(points, exactFit) {
		if (!this.isLoaded()) { return; }
		this.getEngine().zoomToPoints(points, exactFit);
	}
});
