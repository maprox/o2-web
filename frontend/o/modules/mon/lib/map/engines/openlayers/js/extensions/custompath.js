/*
 * Собственный Control для рисования и одновременного редактирования фигур
 * OpenLayers
 * Собран из OpenLayers.Control.ModifyFeature и OpenLayers.Control.DrawFeature
 *
 */
if (C.utils.isset('C.lib.map.openlayers.Extender')) {
	C.lib.map.openlayers.Extender.add(function() {
		OpenLayers.Handler.CustomPath =
			OpenLayers.Class(OpenLayers.Handler.CustomPolygon, {

			createFeature: function(pixel) {
				var lonlat = this.control.map.getLonLatFromPixel(pixel);
				this.point = new OpenLayers.Feature.Vector(
					new OpenLayers.Geometry.Point(lonlat.lon, lonlat.lat)
					);
				this.line = new OpenLayers.Feature.Vector(
					new OpenLayers.Geometry.LineString([this.point.geometry])
					);
				this.point.geometry.clearBounds();
				this.layer.addFeatures([this.line, this.point], {
					silent: true
				});
			},

			CLASS_NAME: "OpenLayers.Handler.CustomPath"
		});
	});
}
