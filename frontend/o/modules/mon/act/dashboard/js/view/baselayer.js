/**
 * Class for map engine of act map
 * ===============================
 *
 * Description goes here
 *
 * @class C.lib.map.BaselayerPortlet
 * @extends C.lib.map.Baselayer
 */

Ext.define('C.lib.map.BaselayerPortlet', {
	extend: 'C.lib.map.Baselayer',
	alias: 'widget.baselayer_portlet',

	mixins: ['C.lib.map.Tracking']
});