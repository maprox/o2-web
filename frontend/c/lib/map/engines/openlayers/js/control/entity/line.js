/**
 * @class C.lib.map.openlayers.entity.Line
 * @extends C.lib.map.openlayers.entity.abstract.Geometry
 */

Ext.define('C.lib.map.openlayers.entity.Line', {
	extend: 'C.lib.map.openlayers.entity.abstract.Geometry',

	/**
	 * Creates linear geometry
	 * @param {OpenLayers.Geometry.Point[]} points
	 */
	createGeometry: function(points) {
		return new OpenLayers.Geometry.LineString(points);
	}
});