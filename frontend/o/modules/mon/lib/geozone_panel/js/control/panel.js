/**
 *
 * @class O.comp.GeozonePanel
 * @extends Ext.panel.Panel
 */
C.utils.inherit('O.comp.GeozonePanel', {
/**
	* @constructs
	*/
	initComponent: function() {
		this.callOverridden(arguments);

		// init params
		this.zoneParams = {};
		this.points = [];
		this.currentPrimitiveID = O.mon.model.Geofence.TYPE_POLYGON;

		// init listeners
		if (this.fieldName) {
			this.fieldName.on('change', 'validate', this);
		}
		if (this.fieldColor) {
			this.fieldColor.on('change', 'colorChanged', this);
		}
		if (this.rbGeofenceTypePolygon) {
			this.rbGeofenceTypePolygon.on('change', 'changePrimitive', this);
		}
		if (this.rbGeofenceTypeCircle) {
			this.rbGeofenceTypeCircle.on('change', 'changePrimitive', this);
		}
		if (this.btnSave) {
			this.btnSave.setHandler(this.createGeozone, this);
		}
		if (this.btnCancel) {
			this.btnCancel.setHandler(this.cancelGeozoneCreation, this);
		}
		this.on('show', 'initValues', this);
	},

/*
	* Returns a geofence object params for sending to the backend
	* @return {Object}
	*/
	getZone: function() {
		if (this.points.length == 0) {
			return {};
		}
		var result = {
				name: this.fieldName.getValue(),
				color: this.fieldColor.getValue(),
				id_type: this.getCurrentPrimitiveID(),
				coords: this.points,
				center_lat: this.centerLat,
				center_lon: this.centerLon
		};
		for (var p in this.zoneParams) {
			result[p] = this.zoneParams[p];
		}
		return result;
	},

/**
	* Get coords
	*/
	getCoords: function() {
		var points = [];
		for (var i = 0; i < this.points.length; i++) {
			var lat = this.points[i].lat;
			var lon = this.points[i].lng;
			points.push({latitude: lat, longitude: lon});
		}
		return points;
	},

/*
	* Загрузка геозоны в панель
	*/
	loadZone: function(zone) {
		this.points = zone.coords;

		this.fieldName.setValue(zone.name);
		this.fieldColor.setValue(zone.color);
		this.rbGeofenceTypeCircle.setValue(false);
		this.rbGeofenceTypePolygon.setValue(false);

		switch (zone.id_type) {
			case O.mon.model.Geofence.TYPE_CIRCLE:
				this.rbGeofenceTypeCircle.setValue(true);
				break;
			default:
				this.rbGeofenceTypePolygon.setValue(true);
				break;
		}

		this.fieldName.resetOriginalValue();
		this.fieldColor.resetOriginalValue();
		this.rbGeofenceTypeCircle.resetOriginalValue();
		this.rbGeofenceTypePolygon.resetOriginalValue();
	},

/*
	* Выбран другой примитив для рисования
	*/
	changePrimitive: function() {
		this.clearPoints();
		this.fieldColor.setValue(this.getGeozoneColor());
		this.fireEvent('primitiveChanged');
	},

/*
	* Сброс значений всех полей перед каждым показом окна
	*/
	initValues: function() {
		this.fieldName.setValue('');
		this.fieldColor.setValue('ff6600');
		this.rbGeofenceTypePolygon.setValue(true);
		this.rbGeofenceTypeCircle.setValue(false);
		this.clearPoints();
	},

 /**
	* Сохранение нарисованной геозоны на сервере
	*/
	createGeozone: function() {
		this.fireEvent('beforeGeozoneCreate');
		this.setLoading(true);
		// Создаем объект геозоны
		O.manager.Model.add('mon_geofence', this.getZone(),
			function (success, opts) {
				this.setLoading(false);
				this.hide();
				if (success && opts.data) {
					var zone = opts.data;
					if (zone && zone.id) {
						this.fireEvent('geozoneCreated', zone.id);
						O.msg.info(_('Geofence has been successfully created'));
					}
				}
			}, this);
	},

/*
	* Возвращает ID текущего рисуемого примитива
	*/
	getCurrentPrimitiveID: function() {
		if (this.rbGeofenceTypePolygon.getValue()) {
			this.currentPrimitiveID = O.mon.model.Geofence.TYPE_POLYGON;
		}
		if (this.rbGeofenceTypeCircle.getValue()) {
			this.currentPrimitiveID = O.mon.model.Geofence.TYPE_CIRCLE;
		}
		return this.currentPrimitiveID;
	},

/*
	* Возвращает текущий рисуемый примитив
	*/
	getCurrentPrimitive: function() {
		switch (this.getCurrentPrimitiveID()) {
			case O.mon.model.Geofence.TYPE_POLYGON: return 'polygon'; break;
			case O.mon.model.Geofence.TYPE_CIRCLE:  return 'circle'; break;
			default:
				return 'polygon';
		}
	},

/*
	* Validation
	*/
	validate: function() {
		var name = this.fieldName.getValue();
		var valid = (name != '') && (!this.notEmptyPoints ||
				(this.notEmptyPoints && this.points &&
					this.points.length > 0));
		if (this.btnSave) {
			this.btnSave.setDisabled(!valid);
		}
		return valid;
	},

/*
	* Сохранить во внутренней памяти объекта список точек геозоны
	* @param {Object[]} points
	*/
	setPoints: function(points) {
		if (!points) {
			this.clearPoints();
			return;
		}
		this.points = points.coords;
		this.centerLat = points.centerLat;
		this.centerLon = points.centerLon;
		this.validate();
	},

	/*
	 * Очищает список точек геозоны
	 * @param {Object[]} points
	 */
	clearPoints: function() {
		this.points = [];
		this.centerLat = 0.0;
		this.centerLon = 0.0;
		this.validate();
	},

/*
	* Changing of the color of colorpicker
	* @param {Ext.form.Field} field
	*/
	colorChanged: function(field) {
		this.fireEvent('colorChanged', field.getValue());
	},

/*
	* Обработчик клика по кнопке "отмена" - по клику нужно сгенерировать событие
	* "Отменить создание геозоны"
	*/
	cancelGeozoneCreation: function() {
		this.fireEvent('creationCanceled');
		this.hide();
	},

/*
	* Возвращает выбранный в пикере цвет геозоны
	* @return String
	*/
	getGeozoneColor: function() {
		if(!this.fieldColor.getValue()) {
			return 'ff6600';
		} else {
			return this.fieldColor.getValue();
		}
	}
});

