/**
 * @class C.lib.map.openlayers.Util
 */

Ext.define('C.lib.map.openlayers.Util', {

	getPoint: function(lat, lng, reverse) {
		var obj = this.getMap().getProjectionObject();
		var epsg = new OpenLayers.Projection("EPSG:4326");
		return new OpenLayers.LonLat(lng, lat).transform(
			reverse ? obj : epsg,
			reverse ? epsg : obj);
	}
});