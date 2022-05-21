/**
 * @class C.lib.map.openlayers.entity.Ring
 * @extends C.lib.map.openlayers.entity.Polygon
 */

Ext.define('C.lib.map.openlayers.entity.Ring', {
	extend: 'C.lib.map.openlayers.entity.Polygon',

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
		 * @cfg {Number} radius
		 * @accessor
		 */
		radius: 100
	},

	/**
	 * Creates linear geometry
	 * @param {OpenLayers.Geometry.Point[]} points
	 */
	createGeometry: function(points) {
		var angle,
			new_latlon,
			geom_point,
			pnts = [],
			sides = 40,
			latlon = new OpenLayers.LonLat(this.getLongitude(),
				this.getLatitude());

		for (var i = 0; i < sides; i++) {
			angle = (i * 360 / sides);
			new_latlon = OpenLayers.Util.destinationVincenty(latlon, angle,
				this.getRadius());
			var pnt = this.getPoint(new_latlon.lat, new_latlon.lon);
			geom_point = new OpenLayers.Geometry.Point(pnt.lon, pnt.lat);
			pnts.push(geom_point);
		}

		return this.callParent([pnts]);
	}
});