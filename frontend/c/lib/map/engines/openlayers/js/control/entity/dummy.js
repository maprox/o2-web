/**
 * @class C.lib.map.openlayers.entity.Dummy
 * @extends C.lib.map.openlayers.entity.abstract.Point
 */

Ext.define('C.lib.map.openlayers.entity.Dummy', {
	extend: 'C.lib.map.openlayers.entity.abstract.Point',

	/**
	 * Moves point on map to LonLat
	 * @param {OpenLayers.LonLat} lonlat
	 */
	moveTo: Ext.emptyFn,

	/**
	 * Creates entity
	 * @protected
	 */
	doCreate: Ext.emptyFn,

	/**
	 * Displays entity on map
	 * @protected
	 */
	doShow: Ext.emptyFn,

	/**
	 * Hides entity from view
	 * @protected
	 */
	doHide: Ext.emptyFn
});