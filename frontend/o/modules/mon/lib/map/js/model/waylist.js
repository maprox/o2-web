/**
 * Waylist manipulating functionality
 * ===============================
 *
 * Description goes here
 *
 * @class O.lib.map.Waylist
 * @extends C.lib.map.History
 */

Ext.define('O.lib.map.Waylist', {
	extend: 'C.lib.map.History',

	waylistProgressColor: '0000ff',

	waylistPathStyle: {
		strokeColor: '#0033FF',
		strokeOpacity: 0.3,
		strokeWidth: 10,
		graphicZIndex: 400
	},
	garagePathStyle: {
		strokeColor: '#adff2f',
		strokeOpacity: 0.3,
		strokeWidth: 10,
		graphicZIndex: 400
	},

	waylistPointStyle: {
		strokeColor: '#0033FF',
		fillColor: '#6699FF',
		fontColor: '#FFFFFF',
		fontFamily: "sans-serif",
		fontWeight: "bold",
		strokeWidth: 4,
		pointRadius: 10,
		graphicZIndex: 420
	},
	garagePointStyle: {
		strokeColor: '#adff2f',
		fillColor: '#32cd32',
		fontColor: '#FFFFFF',
		fontFamily: "sans-serif",
		fontWeight: "bold",
		strokeWidth: 4,
		pointRadius: 10,
		graphicZIndex: 420
	},

	/**
	 * @protected
	 * @cfg Ext.util.MixedCollection
	 */
	points: null,

	/**
	 * @protected
	 * @cfg Ext.util.MixedCollection
	 */
	routes: null,

	/**
	 * Метод, возвращающий указатель на список точек пути.
	 * При необходимости объект списка создается
	 * @returns Ext.util.MixedCollection
	 * @protected
	 */
	getPoints: function() {
		if (!this.devices) {
			this.devices = new Ext.util.MixedCollection();
		}
		return this.devices;
	},

	/**
	 * Метод, возвращающий указатель на список маршрутов.
	 * При необходимости объект списка создается
	 * @returns Ext.util.MixedCollection
	 * @protected
	 */
	getRoutes: function() {
		if (!this.devices) {
			this.devices = new Ext.util.MixedCollection();
		}
		return this.devices;
	},

	/**
	 * Places route point on map
	 * @param {float} latitude
	 * @param {float} longitude
	 * @param {String[]} name
	 * @param {Boolean} isGarage
	 */
	placeRoutePoint: function(latitude, longitude, name, isGarage) {
		this.getPoints().add(this.getEngine().addRoutePoint(latitude, longitude,
			name, isGarage ? this.garagePointStyle : this.waylistPointStyle));
	},

	/**
	 * Draws path between route points on map
	 * @param {float[][]} coords
	 * @param {Boolean} isGarage
	 */
	drawRoute: function(coords, isGarage) {
		this.getRoutes().add(this.getEngine().drawRoute(coords,
			isGarage ? this.garagePathStyle : this.waylistPathStyle));
	},

	/**
	 * Clears route data
	 */
	clearRouteData: function() {
		this.getPoints().each(function(point){
			point.destroy();
		});
		this.getPoints().clear();
		this.getRoutes().each(function(route){
			route.destroy();
		});
		this.getRoutes().clear();
	},

	drawWaylistPackets: function(packets) {
		this.clearTracks();

		if (packets.length) {
			this.getTracks().add(
				this.drawTrackLine(packets, this.waylistProgressColor));
		}
	}
});