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
	_STOPPING_MIN_RADIUS: 20,
	_STOPPING_MAX_RADIUS: 60,
	_STOPPING_KOEF: 1.5,

/**
	 * @cfg {Mixed[]}
	 * Storage for provided states
	 */
	providedState: {},

	/**
	 * @cfg {Boolean}
	 * Display labels with devices
	 */
	displayDeviceLabels: false,

/**
	* Constructs
	*/
	initialize: function() {

		this.callParent(arguments);
		this.initParameters();

		this.on({
			painted: 'onReady',
			moveend: 'onMoveEnd',
			zoomend: 'onZoomEnd',
			selectpacket: 'onSelectPacket',
			scope: this
		});
	},

	/**
	 * Init engine parameters
	 * @param {C.lib.map.Engine} engine
	 */
	initEngine: function(engine) {
		this.callParent(arguments);
		// let's assign this.objects to engine
		engine.objects = this.objects;
	},

/**
	* Draws stoppings circles on map
	* @param {Ext.util.MixedCollection} stoppings Stoppings data
	*/
	drawStoppings: function(stoppings) {
		var engine = this.getEngine();

		if (stoppings == null) { return []; }

		//Получить время стоянки
		var ts = 300;
		Ext.each(stoppings, function(stopping){
			var duration = stopping.getTime();
			var coord = stopping.get('start_point');
			engine.moveToPoints([coord]);

			if (duration > ts) {
				//Посчитать радус круга
				var r = Math.round(this._STOPPING_MIN_RADIUS +
					this._STOPPING_KOEF * duration / ts);
				if (r > this._STOPPING_MAX_RADIUS) {
					r = this._STOPPING_MAX_RADIUS;
				}
				stopping.circle = engine.addRing(coord.latitude,
					coord.longitude, r, this.stoppingStyle);
				stopping.info = engine.addInscription(coord.latitude,
					coord.longitude, O.timeperiod.formatPeriod(duration * 1000));
			}
		}, this);

		return stoppings;
	},

	/**
	 * Do when engine is loaded
	 * @param {Function} fn
	 * @param {Object} scope
	 */
	doOnLoad: function(fn, scope) {
		var me = this;
		C.utils.wait(function() {
			return me.isLoaded();
		}, {
			callback: fn,
			scope: scope || this
		});
	},

/**
	* Обработчик движения карты
	*/
	onMoveEnd: Ext.emptyFn,

/**
	* Устанавливает значение для старта карты
	* @param {String} key
	* @param {Mixed} value
	*/
	setProvidedState: function(key, value) {
		this.providedState[key] = value;
	},

/**
	* Метод, возвращающий указатель на список устройств.
	* При необходимости объект списка создается
	* @returns Ext.util.MixedCollection
	* @protected
	*/
	getInitialMapState: function() {
		return {
			center: this.providedState.center || {
				lat: this._INITIAL_LAT,
				lng: this._INITIAL_LON
			},
			zoom: this.providedState.zoom || this._INITIAL_ZOOM
		};
	},

/**
	* Get property value of an engine
	* @param {String} prop
	* @return {Object} Value of a property
	*/
	getProp: function(prop) {
		if (!this.isLoaded()) { return undefined; }
		var method = 'get' + Ext.String.capitalize(prop),
			engine = this.getEngine(),
			fn = engine[method];
		return fn && Ext.isFunction(fn) ? fn.call(engine) : undefined;
	},

/**
	* Set property value of an engine
	* @param {String} prop
	* @param {Object} value
	*/
	setProp: function(prop, value) {
		var me = this;
		C.utils.wait(function() {
			return me.isLoaded();
		}, {
			callback: function(success) {
				if (!success) { return; }
				var method = 'set' + Ext.String.capitalize(prop),
					engine = me.getEngine(),
					fn = engine[method];
				if (fn && Ext.isFunction(fn)) {
					fn.call(engine, value);
				}
			}
		});
	},

	/**
	 * Сформатировать данные для метки устройства
	 * @param {Object} device объект с информацией об устройстве из this.devices
	 * @param {Object} packet последний пакет
	 */
	getDeviceLabelData: function(device, packet) {
		var count = packet.satellitescount;
		var name = packet.device.name;

		if (count > this.progressWidth.length - 1) {
			count = this.progressWidth.length - 1;
		}
		var satellites = "<div class='gps-signal-info'>" +
			"<div class='gps-signal-meter' style='width: " +
			this.progressWidth[count] +
			"px !important;'></div></div>";

		return [{title: name, value: satellites}];
	}
});
