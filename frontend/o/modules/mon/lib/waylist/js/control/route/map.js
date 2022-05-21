/**
 * @class O.mon.lib.waylist.TabRoute
 * @extends C.lib.map.Baselayer
 */
C.utils.inherit('O.mon.lib.waylist.RouteMap', {

	/**
	 * @constructor
	 */
	initComponent: function() {
		this.callOverridden(arguments);
		this.layer.on({
			engineLoad: 'onLayerReady',
			scope: this
		});
	},

	/**
	 * Fires when engine is loaded
	 */
	onLayerReady: function() {
		if (this.currentCoords || this.currentStart || this.currentEnd) {
			this.setRoutePoints(this.currentCoords, this.currentStart,
				this.currentEnd);
		}
		if (this.currentPackets) {
			this.addPackets([]);
		}
	},

	/**
	 * Центрирует карту на указанных координатах
	 * @param {float} lat - Широта
	 * @param {float} lng - Долгота
	 */
	setCenter: function(lat, lng) {
		this.layer.setCenter(lat, lng);
	},

	/**
	 * Стирает уже пройденный путь с карты
	 */
	clearPackets: function() {
		this.currentPackets = [];
		if (!this.layer.isLoaded()) { return; }
		this.layer.drawWaylistPackets([]);
	},

	/**
	 * Рисует уже пройденный путь на карте
	 * @param packets
	 */
	addPackets: function(packets) {
		this.currentPackets = this.currentPackets.concat(packets);
		if (!this.layer.isLoaded()) { return; }
		this.layer.drawWaylistPackets(this.currentPackets);
	},

	/**
	 * Focuses on chosen points
	 */
	doFocus: function() {
		var points = this.currentCoords ? this.currentCoords.clone() : [];
		points.unshift(this.currentStart);
		points.push(this.currentEnd);
		var display = [];
		Ext.each(points, function(point){
			if (typeof point == 'object' && point.lat && point.lon) {
				display.push({latitude: point.lat, longitude: point.lon});
			}
		});

		this.layer.zoomToPoints(display);
	},

	/**
	 * Marks points on map
	 * @param {Object[]} coords
	 * @param {Object} start
	 * @param {Object} end
	 */
	setRoutePoints: function(coords, start, end) {
		this.currentCoords = coords;
		this.currentStart = start;
		this.currentEnd = end;

		if (!this.layer.isLoaded()) { return; }

		if (start && end && (start.lat == end.lat) && (start.lon == end.lon)) {
			start.name = end.name = _('G');
		} else {
			if (start) {
				start.name = _('G1');
			}
			if (end) {
				end.name = _('G2');
			}
		}

		if (start) {
			start.isGarage = true;
		}
		if (end) {
			end.isGarage = true;
		}

		coords.unshift(start);
		coords.push(end);

		this.layer.clearRouteData();

		var lastCoord = false;
		var setPoints = {};
		Ext.each(coords, function(coord) {
			if (coord) {
				var index = coord.lat + ' ' + coord.lon;
				if (!setPoints[index]) {
					setPoints[index] = {
						lat: coord.lat, lon: coord.lon, name: [], garage: false
					};
				}
				if (coord.isGarage) {
					setPoints[index].garage = true;
					setPoints[index].name = [coord.name];
				} else if (!setPoints[index].garage) {
					setPoints[index].name.push(coord.name);
				}

				if (lastCoord) {
					var garageStyle = lastCoord.isGarage || coord.isGarage;
					var cacheKey = lastCoord.lat + ' ' + lastCoord.lon + ' ' +
						coord.lat + ' ' + coord.lon;
					if (this.coordsCache[cacheKey]) {
						this.layer.drawRoute(this.coordsCache[cacheKey],
							garageStyle);
						if (this.calcCache[cacheKey] && coord.id) {
							this.fireEvent('route_data_calc',
								coord.id, this.calcCache[cacheKey]);
						}
					} else {
						this.fetchRoute(lastCoord.lat, lastCoord.lon,
							coord.lat, coord.lon, coord.id, garageStyle);
					}
				}
				lastCoord = coord;
			}
		}, this);

		Ext.Object.each(setPoints, function(key, data) {
			this.layer.placeRoutePoint(data.lat, data.lon,
				data.name, data.garage);
		}, this);
	},

	/**
	 * Draws path between route points
	 * @param {float} fromLat
	 * @param {float} fromLon
	 * @param {float} toLat
	 * @param {float} toLon
	 * @param {Number} toId
	 * @param {Boolean} isGarage
	 */
	fetchRoute: function(fromLat, fromLon, toLat, toLon, toId, isGarage) {
		this.setLoading(true);
		this.loadingCount++;
		Ext.Ajax.request({
			url: '/mon_waylist_route/route',
			params: {fromLat: fromLat, fromLon: fromLon,
				toLat: toLat, toLon: toLon},
			method: 'GET',
			scope: this,
			success: function(result) {
				this.loadingCount--;
				if (this.loadingCount <= 0) {
					this.setLoading(false);
				}
				var data = {};
				try {
					data = Ext.decode(result.responseText);
				} catch (e) {
					console.error(e);
					return;
				}
				if (data.success && data.data && data.data.found) {
					var cacheKey = fromLat + ' ' + fromLon + ' ' +
						toLat + ' ' + toLon;
					this.coordsCache[cacheKey] = data.data.coords;
					this.calcCache[cacheKey] = data.data;

					this.layer.drawRoute(data.data.coords, isGarage);
					if (toId) {
						this.fireEvent('route_data_calc', toId, data.data);
					}
				}
			}
		});
	}
});