/**
 * Class for map engine of act map
 * ===============================
 *
 * Description goes here
 *
 * @class C.lib.map.BaselayerMap
 * @extends C.lib.map.Baselayer
 */

Ext.define('C.lib.map.BaselayerMap', {
	extend: 'C.lib.map.Baselayer',
	alias: 'widget.baselayer_map',

	mixins: ['C.lib.map.Zone', 'C.lib.map.Tracking']
});
