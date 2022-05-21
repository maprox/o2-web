/**
 * Class for map engine of act map
 * ===============================
 *
 * Description goes here
 *
 * @class C.lib.map.BaselayerWarehouse
 * @extends C.lib.map.Baselayer
 */

Ext.define('C.lib.map.BaselayerWarehouse', {
	extend: 'C.lib.map.Baselayer',
	alias: 'widget.baselayer_warehouse',

	mixins: ['O.lib.map.Warehouse']
});