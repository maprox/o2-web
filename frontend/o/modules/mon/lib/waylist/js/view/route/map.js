C.define('O.mon.lib.waylist.RouteMap', {
	extend: 'C.ui.Panel',
	alias: 'widget.mon-waylist-routemap',

	/**
	 * currently drawn coords
	 * @type {Object[]}
	 */
	currentCoords: null,

	/**
	 * currently drawn start
	 * @type {Number[]}
	 */
	currentStart: null,

	/**
	 * currently drawn end
	 * @type {Number[]}
	 */
	currentEnd: null,

	/**
	 * currently drawn packets
	 * @type {Object[]}
	 */
	currentPackets: [],

	/**
	 * Coordinates cache
	 * @type {float[][][]}
	 */
	coordsCache: [],

	/**
	 * Distance calc cache
	 * @type {float[]}
	 */
	calcCache: [],

	/**
	 * Number of concurrent fetch requests
	 * @type {Number}
	 */
	loadingCount: 0,

	/**
	 * @constructor
	 */
	initComponent: function() {
		Ext.apply(this, {
			layout: 'fit',
			border: false,
			items: [{
				xtype: 'baselayer_route'
			}]
		});
		this.callParent(arguments);
		this.layer = this.down('baselayer_route');
	}
});