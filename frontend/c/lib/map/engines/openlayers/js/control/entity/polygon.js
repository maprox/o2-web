/**
 * @class C.lib.map.openlayers.entity.Polygon
 * @extends C.lib.map.openlayers.entity.abstract.Geometry
 */

Ext.define('C.lib.map.openlayers.entity.Polygon', {
	extend: 'C.lib.map.openlayers.entity.abstract.Geometry',

	/**
	 * Creates linear geometry
	 * @param {OpenLayers.Geometry.Point[]} points
	 */
	createGeometry: function(points) {
		return new OpenLayers.Geometry.LinearRing(points);
	}
});