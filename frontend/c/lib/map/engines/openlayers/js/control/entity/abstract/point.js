/**
 * @class C.lib.map.openlayers.entity.abstract.Point
 * @extends C.lib.map.openlayers.entity.abstract.Base
 */

Ext.define('C.lib.map.openlayers.entity.abstract.Point', {
	extend: 'C.lib.map.openlayers.entity.abstract.Base',

	config: {
		/**
		 * @cfg {Number} latitude
		 * @accessor
		 */
		latitude: 0.00,
		/**
		 * @cfg {Number} longitude
		 * @accessor
		 */
		longitude: 0.00,
		/**
		 * @cfg {OpenLayers.LonLat} lonLat
		 * Converted coordinates
		 * @accessor
		 */
		lonLat: null
	},

	/**
	 * @constructs
	 * @param {Object} config Объект конфигурации
	 */
	constructor: function(config) {
		config.longitude = config.longitude || config.lon;
		config.latitude = config.latitude || config.lat;

		this.callParent(arguments);

		return this;
	},

	/**
	 * Displays entity on map
	 */
	create: function() {
		if (!this.getLonLat()) {
			this.setLonLat(this.getPoint(this.getLatitude(),
				this.getLongitude()));
		}
		this.callParent(arguments);
	},

	/**
	 * Moves point on map to coordinates
	 * @param {Number} lon
	 * @param {Number} lat
	 */
	move: function(lon, lat) {
		this.moveTo(this.getPoint(lon, lat))
	},

	/**
	 * Moves point on map to LonLat
	 * @param {OpenLayers.LonLat} lonlat
	 */
	moveTo: function(lonlat) {
		console.error('Function "moveTo" not implemented!');
	},

	/**
	 * Change point coordinates by given numbers
	 * @param {Number} lon
	 * @param {Number} lat
	 */
	moveBy: function(lon, lat) {
		this.move(this.getLongitude() + lon, this.getLatitude() + lat);
	},

	/**
	 * Checks, if entity is inside given bounds
	 * @param {OpenLayers.Bounds} bounds
	 */
	insideBounds: function(bounds) {
		return bounds.containsLonLat(this.getLonLat());
	}
});
