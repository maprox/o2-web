/**
 *
 * @class O.mon.geofence.tab.Map
 */
C.utils.inherit('O.mon.geofence.tab.Map', {

/**
	* @constructor
	*/
	initComponent: function() {
		this.callOverridden(arguments);
		this.geofenceDirty = false;
		// init listeners
		if (this.geozonePanel) {
			this.geozonePanel.on({
				colorChanged: 'onColorChanged',
				primitiveChanged: 'onPrimitiveChanged',
				geozoneChanged: 'onGeozoneEdit',
				scope: this
			});
		}
		if (this.baseLayer) {
			this.baseLayer.on({
				engineLoad: 'engineLoad',
				afterrender: 'updateEngine',
				scope: this
			});
		}

		this.on('recordload', 'doOnRecordLoad', this);
	},

/**
	* Handles record loading
	* @param {Object} tab
	* @param {Object} record
	* @param {Boolean} noReset
	*/
	doOnRecordLoad: function(tab, record, noReset) {
		if (!noReset && !this.isDirty()) {
			this.loadZone(record.data);
		} else {
			if (!noReset) {
				this.reset();
			}
		}
	},

/**
	* Geofence editing handler
	*/
	onGeozoneEdit: function() {
		this.setPoints();
	},

/**
	* New geofence drawing handler
	*/
	geozoneChanged: function() {
		this.setPoints();
	},

/**
	* Set points to layer and record if needed
	*/
	setPoints: function() {
		var record = this.getSelectedRecord();
		this.geozonePanel.setPoints(this.baseLayer.getPointsArray());
		if (!this.handleGeozoneEvents) {
			return;
		} else {
			record.set('coords', this.geozonePanel.getCoords());
			this.geofenceDirty = true;
			this.fireEvent('dirtychange');
		}
	},

/**
	* Color of edited zone was changed
	*/
	onColorChanged: function(color) {
		this.baseLayer.changeGeoDrawingColor(color);
	},

/**
	* Geofence type is changed
	*/
	onPrimitiveChanged: function() {
		if (!this.handleGeozoneEvents) { return; }
		this.fireEvent('dirtychange');
		this.baseLayer.changeGeoDrawingColor(
			this.geozonePanel.getGeozoneColor());
		this.baseLayer.stopGeoEditing();
		this.baseLayer.startGeoDrawing(
			this.geozonePanel.getCurrentPrimitive());
	},

/*
	* Load zone to editor
	* @param {Object} zone
	*/
	loadZone: function(zone) {
		this.handleGeozoneEvents = false;
		this.geozonePanel.loadZone(zone);
		this.baseLayer.stopGeoEditing();
		if (zone.coords && zone.coords.length > 0) {
			this.baseLayer.startGeoEditing(zone,
				this.geozonePanel.getCurrentPrimitive());
		} else {
			this.baseLayer.startGeoDrawing(
				this.geozonePanel.getCurrentPrimitive());
			this.baseLayer.changeGeoDrawingColor(
				this.geozonePanel.getGeozoneColor());
		}
		this.geofenceDirty = false;
		this.fireEvent('dirtychange');
		this.handleGeozoneEvents = true;
	},

/**
	* Установить обработчики событий для движка карт после его загрузки
	*/
	engineLoad: function() {
		this.baseLayer.getEngine().on({
			pointAdded: 'geozoneChanged',
			primitiveChanged: 'geozoneChanged',
			primitiveEdit: 'onGeozoneEdit',
			scope: this
		});
	},

/**
	* Update engine size
	*/
	updateEngine: function() {
		//this.baseLayer.onResize();
	},

/**
	* При изменении размеров компонента нужно подогнать под него размер карты
	* или загрузить движок если он еще не загружен и загрузка разрешена
	*//*
	onResize: function() {
		this.updateEngine();
	},*/

/**
	* Geofence validation
	* @return Boolean
	*/
	isValidZone: function() {
		var data = this.baseLayer.getPointsArray();
		if (!this.geozonePanel.notEmptyPoints) {
			// 0 or more then 2 points 
			return (data.coords &&
				(data.coords.length == 0 || data.coords.length > 2));
		}
		return (data.coords && data.coords.length > 2);
	},

/**
	* Updates record with form data
	* @param {Ext.data.Model} record
	*/
	updateRecord: function(record) {
		this.callParent(arguments);
		if (!record) { return; }
		// Get zone coords and center
		var zone = this.geozonePanel.getZone();

		if (zone) {
			// Set default color
			if(!record.get('color')) {
				record.set('color', 'ff6600');
			}
			record.set('coords', zone.coords);
			record.set('center_lat', zone.center_lat);
			record.set('center_lon', zone.center_lon);
		}

		this.geofenceDirty = false;
		this.fireEvent('dirtychange');
	},

/**
	* Returns true if current tab has changes
	* @return {Boolean}
	*/
	isDirty: function() {
		// If zone is not valid allways false
		if (!this.isValidZone()) {
			return false;
		}
		if (this.getForm().isDirty()) {
			return true;
		} else {
			return this.geofenceDirty;
		}

		return false;
	},

/**
	* Resets data
	*/
	reset: function() {
		this.callParent(arguments);
		var record = this.getSelectedRecord();
		record.reject();
		this.loadZone(record.data);
		this.geofenceDirty = false;
		this.fireEvent('dirtychange');
	}
});
