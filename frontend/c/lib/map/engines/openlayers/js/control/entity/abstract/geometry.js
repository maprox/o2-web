/**
 * @class C.lib.map.openlayers.entity.abstract.Geometry
 * @extends C.lib.map.openlayers.entity.abstract.Base
 */

Ext.define('C.lib.map.openlayers.entity.abstract.Geometry', {
	extend: 'C.lib.map.openlayers.entity.abstract.Base',

	config: {
		/**
		 * @cfg {Mixed[]} options
		 * Style options
		 * @accessor
		 */
		options: {},
		/**
		 * @cfg {Object[]} points
		 * Points to draw
		 * @accessor
		 */
		points: [],
		/**
		 * @cfg {OpenLayers.Feature.Vector} feature
		 * Geometry object
		 * @accessor
		 */
		feature: null
	},

	/**
	 * Checks, if matches geometry id
	 */
	matchId: function(id) {
		return this.getGeometry().id == id;
	},

	/**
	 * Checks, if entity is inside given bounds
	 * @param {OpenLayers.Bounds} bounds
	 */
	insideBounds: function(bounds) {
		return this.getGeometry().getBounds().intersectsBounds(bounds);
	},

	/**
	 * Returns centroid for geometry
	 */
	getCentroid: function() {
		return this.getGeometry().getCentroid();
	},

	/**
	 * Creates entity
	 * @protected
	 */
	doCreate: function() {
		var drawingPoints = [];
		var points = this.getPoints();
		for (var i = 0; i < points.length; i++) {
			var pnt = this.getPoint(points[i].latitude, points[i].longitude);
			drawingPoints.push(new OpenLayers.Geometry.Point(pnt.lon, pnt.lat));
		}
		var line = this.createGeometry(drawingPoints);
		//создаем векторную фигуру
		var feature = new OpenLayers.Feature.Vector(line, {}, this.getOptions());

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
		this.doHide();
		if (this.getFeature()) {
			this.getFeature().geometry.destroy();
			this.getFeature().destroy();
			this.setFeature(null);
		}
		this.callParent(arguments);
	},

	/**
	 * Getter
	 * @protected
	 * @return {OpenLayers.Geometry}
	 */
	getGeometry: function() {
		return this.getFeature().geometry;
	},

	/**
	 * Creates linear geometry
	 * @param {OpenLayers.Geometry.Point[]} points
	 */
	createGeometry: function(points) {
		console.error('Function "createGeometry" not implemented!');
		return null;
	}
});