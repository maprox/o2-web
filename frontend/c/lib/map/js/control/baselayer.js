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
	* Openlayers engine activation.
	* Checks if desktop is not locked and panel is rendered.
	* If everything is ok, loads scripts and renders map
	*/
	activateEngine: function() {
		if (this.isLoaded() || O.ui.Desktop.isLocked() ||
			!(this.getEl ? this.getEl() : this.element)) {
			return;
		}

		C.lockDesktop();
		this.lock();
		C.lib.map.Helper.load(this.onApiLoad, this);
	},

/**
	* Creates engine when api is loaded
	*/
	onApiLoad: function(result, error) {
		//try
		//{
			if (!result) { // Error during engine load
				O.msg.error(this.lngLoadErrText);
				this.disable();
				return;
			}

			var engine = C.lib.map.Helper.createEngine({
				withDrag: this.withDrag
			});

			this.add(engine);
			this.addEngineEvents(engine);
			this.initEngine(engine);
			this.fireEvent('engineLoad');

		//} catch(e) {
		//	throw e;
		//} finally {
			this.unlock();
			C.unlockDesktop();
		//}
	},

	/**
	 * Returns an object of selected objects
	 * @return {Object}
	 * @private
	 */
	getSelectedObjects: function() {
		if (!this.selectedObjects) {
			this.selectedObjects = {};
		}
		return this.selectedObjects;
	},

	/**
	 * Returns an id of selected object by its alias.
	 * If no selected object for this alias returns null
	 * @return {Number|null}
	 */
	getSelectedObject: function(alias) {
		var so = this.getSelectedObjects();
		if (!so[alias]) {
			so[alias] = null;
		}
		return so[alias];
	},

	/**
	 * Sets identifier of a selected object
	 * @param {String} alias (devices | zones)
	 * @param {Number} id Object identifier
	 */
	setSelectedObject: function(alias, id) {
		var so = this.getSelectedObjects();
		so[alias] = id;
	},

	/**
	 * Метод обновления данных и центрирования на выбранных устройствах
	 * @param {Boolean} isZoomEvent If true, then do not use bounds
	 */
	updateMap: function(isZoomEvent) {
		if (!this.isLoaded()) { return; }

		Ext.Object.each(this.mixins, function(key, mixin){
			if (mixin.onMapUpdate) {
				mixin.onMapUpdate.call(this, isZoomEvent);
			}
		}, this);
	},

	/**
	 * Init engine parameters
	 * @param {C.lib.map.Engine} engine
	 */
	initEngine: function(engine) {
		engine.setCenter(this.mapState.center.lat, this.mapState.center.lng);
		engine.setZoom(this.mapState.zoom);
		this.setEngine(engine);
	},

/**
	* Add observers for engine events
	* @param {C.lib.map.Engine} engine
	*/
	addEngineEvents: function(engine) {
		this.relayEvents(engine, [
			'selectpacket',
			'moveend',
			'zoomend',
			'layerswitched'
		]);
		engine.on({
			geocodeFinished: 'onGeocodeFinished',
			scope: this
		});
	},

/**
	* Ready handler. Renders map
	*/
	onReady: function() {
		if (!this.alreadyActivated) {
			this.alreadyActivated = true;
			this.activateEngine();
		}
	},

/**
	* Reset map controls to default
	*/
	resetControls: function() {
		if (this.isLoaded()) {
			this.getEngine().resetControls();
		}
	},

/**
	* Обработчик движения карты
	* @param {Object} map Объект карты
	*/
	onMoveEnd: Ext.emptyFn,

/**
	* Map zoomend handler
	*/
	onZoomEnd: function() {
		if (!this.isLoaded()) { return; }
		this.updateMap(true);
	},

/**
	* Is engine loaded
	* @return bool
	*/
	isLoaded: function() {
		return !Ext.isEmpty(this.getEngine());
	},

	formatGeocodeData: function(obj) {
		return Ext.String.format(this.lngTemplateGeocode,
			obj.addr, obj.latitude, obj.longitude);
	},

/**
	 * Show baloon with geocoding results when geocoding is finished
	 * @param {Object} obj Object with geocoding params
	 */
	onGeocodeFinished: function(obj) {
		this.showBaloon(this.formatGeocodeData(obj),
			obj.latitude, obj.longitude);
	}
});
