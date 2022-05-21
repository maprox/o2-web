/**
 * Class for map engine of act map
 * ===============================
 *
 * Description goes here
 *
 * @class C.lib.map.BaselayerTrackhistory
 * @extends C.lib.map.Baselayer
 */

Ext.define('C.lib.map.BaselayerTrackhistory', {
	extend: 'C.lib.map.Baselayer',
	alias: 'widget.baselayer_trackhistory',

	mixins: ['C.lib.map.Device', 'C.lib.map.Zone', 'C.lib.map.History']
});