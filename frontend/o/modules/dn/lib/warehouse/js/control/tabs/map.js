/**
 * @class O.dn.lib.warehouse.tab.Map
 */
C.utils.inherit('O.dn.lib.warehouse.tab.Map', {
/**
	* @constructor
	*/
	initComponent: function() {
		this.callOverridden(arguments);
		this.on({
			recordload: 'onRecordLoad',
			scope: this
		});
		this.baseLayer.on({
			engineload: 'onEngineLoad',
			warehousemoved: 'onWarehouseMoved',
			scope: this
		});
	},

/**
	* Loads data from record
	*/
	onRecordLoad: function() {
		this.moveWarehouse();
	},
/**
	* Search specified address on map
	*/
	doFindOnMap: function(address) {
		if (!address) { return; }
		var geocoder = C.lib.map.Helper.getGeocoder();
		if (geocoder) {
			geocoder.geocode({
				address: address
			}, {
				success: this.onGeocodeSuccess,
				failure: this.onGeocodeFailure,
				scope: this
			});
		}
	},

/**
	* Handles geocode success answer
	* @param {Object} result
	*/
	onGeocodeSuccess: function(result) {
		var lat = result.latitude;
		var lon = result.longitude;
		if (lat == 0 && lon == 0) {
			this.onGeocodeFailure();
		} else {
			this.moveWarehouse(lat, lon);
		}
	},

/**
	* Handles geocode failure answer
	*/
	onGeocodeFailure: function() {
		O.msg.warning(_('Coordinates of the specified address was not found.')
			+ '<br/>' + _('Please, try to locate address manually.'));
		this.moveWarehouse();
	},

/**
	* Displays warehouse marker on the map
	* @param {Float} lat Latitude value
	* @param {Float} lon Longitude value
	*/
	moveWarehouse: function(lat, lon) {
		this.baseLayer.removeWarehouse();
		if (!lat && !lon) {
			var record = this.getSelectedRecord();
			if (record) {
				lat = record.get('lat');
				lon = record.get('lon');
			}
			if (!lat && !lon) {
				lat = this.defaultLatitude;
				lon = this.defaultLongitude;
			}
		} else {
			this.fieldLat.setValue(lat);
			this.fieldLon.setValue(lon);
		}
		this.baseLayer.addWarehouse(lat, lon);
	},

/**
	* Engine load handler
	* @private
	*/
	onEngineLoad: function() {
		/*this.baseLayer.getEngine().on({
			scope: this
		});*/
	},

/**
	* Change field values of the form
	* @param {Float} lat
	* @param {Float} lon
	*/
	onWarehouseMoved: function(lat, lon) {
		this.moveWarehouse(lat, lon);
	},

/**
	* Handler for the form reset action
	*/
	reset: function() {
		this.callParent(arguments);
		this.moveWarehouse();
	}
});
