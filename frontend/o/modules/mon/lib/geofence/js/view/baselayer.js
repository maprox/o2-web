/**
 * Class for map engine of act map
 * ===============================
 *
 * Description goes here
 *
 * @class C.lib.map.BaselayerGeofence
 * @extends C.lib.map.Baselayer
 */

Ext.define('C.lib.map.BaselayerGeofence', {
	extend: 'C.lib.map.Baselayer',
	alias: 'widget.baselayer_geofence',

	mixins: ['C.lib.map.Zone', 'O.lib.map.ZoneDraw']
});