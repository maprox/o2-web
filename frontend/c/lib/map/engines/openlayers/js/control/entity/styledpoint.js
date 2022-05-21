/**
 * @class C.lib.map.openlayers.entity.StyledPoint
 * @extends C.lib.map.openlayers.entity.abstract.Point
 */

Ext.define('C.lib.map.openlayers.entity.StyledPoint', {
	extend: 'C.lib.map.openlayers.entity.abstract.Point',

	config: {
		/**
		 * @cfg {Mixed[]} options
		 * Style options
		 * @accessor
		 */
		options: {},
		/**
		 * @cfg {OpenLayers.Feature.Vector} feature
		 * Geometry object
		 * @accessor
		 */
		feature: null
	},

	/**
	 * Moves point on map to LonLat
	 * @param {OpenLayers.LonLat} lonlat
	 */
	moveTo: function(lonlat) {
		var point = this.getFeature().geometry;
		point.move(lonlat.lon, lonlat.lat);
	},

	/**
	 * Creates entity
	 * @protected
	 */
	doCreate: function() {
		var point = new OpenLayers.Geometry.Point(
			this.getLonLat().lon, this.getLonLat().lat);
		var feature = new OpenLayers.Feature.Vector(
			point, {}, this.getOptions());

		this.setFeature(feature);
	},

	/**
	 * Displays entity on map
	 * @protected
	 */
	doShow: function() {
		this.getLayer().addFeatures([this.getFeature()]);
	},

	/**
	 * Hides entity from view
	 * @protected
	 */
	doHide: function() {
		if (this.getFeature()) {
			this.getLayer().removeFeatures([this.getFeature()]);
		}
	},

	/**
	 * Destroys entity
	 */
	destroy: function() {
		if (this.getFeature()) {
			this.getFeature().destroy();
			this.setFeature(null);
		}
		this.callParent(arguments);
	}
});