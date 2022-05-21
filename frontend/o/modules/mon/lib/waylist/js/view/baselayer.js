/**
 * Class for map engine of waylist
 * ===============================
 *
 * Description goes here
 *
 * @class C.lib.map.BaselayerRoute
 * @extends C.lib.map.Baselayer
 */

Ext.define('C.lib.map.BaselayerRoute', {
	extend: 'C.lib.map.Baselayer',
	alias: 'widget.baselayer_route',

	mixins: ['O.lib.map.Waylist']
});