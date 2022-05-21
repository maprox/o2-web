/*
 * Control for search by address action
 *
 */
if (C.utils.isset('C.lib.map.openlayers.Extender')) {
	C.lib.map.openlayers.Extender.add(function() {
		OpenLayers.Control.GeocodeControl = OpenLayers.Class(
			OpenLayers.Control, {

				initialize: function(handler, options) {
					OpenLayers.Control.prototype.initialize.apply(this, [options]);
					this.mapEventAttached = false;
					this.clicksDisabled = false;
					this.disableEvents = false;
				},

/**
	* Map click event handler
	*/
				mapClick: function(e) {
					if (this.clicksDisabled) return;
					if (!this.active) return;
					var ll = this.map.getLonLatFromViewPortPx(e.xy);
					OpenLayers.Element.addClass(this.map.viewPortDiv, 'waitCursor');
					var point = this.map.observerEngine.getPoint(ll.lat, ll.lon, true);

					C.lib.map.Helper.getGeocoder().geocode({
						lat: point.lat,
						lng: point.lon
					}, {
						success: function(data) {
							if (!this.disableEvents) {
								this.events.triggerEvent('pointselected', {
									click_latitude: point.lat,
									click_longitude: point.lon,
									latitude: data.latitude,
									longitude: data.longitude,
									address: data.address
								});
							}
						},
						scope: this
					});
				},

/**
	* Control activation
	*/
				activate: function () {
					//console.log(this.map);
					OpenLayers.Control.prototype.activate.apply(this);
					OpenLayers.Element.addClass(this.map.viewPortDiv, 'geocodeCursor');
					this.clicksDisabled = false;
					if (!this.mapEventAttached) {
						var me = this;
						this.map.events.on({
							click: function() {
								return me.mapClick.apply(me, arguments);
							}
						});
						this.mapEventAttached = true;
					}
					this.disableEvents = false;
				},

/**
	* Control deactivation
	*/
				deactivate: function() {
					this.disableEvents = true;
					OpenLayers.Control.prototype.deactivate.apply(this);
					OpenLayers.Element.removeClass(this.map.viewPortDiv, 'geocodeCursor');
					OpenLayers.Element.removeClass(this.map.viewPortDiv, 'waitCursor');
				},

				CLASS_NAME: "OpenLayers.Control.GeocodeControl"
		});

	});
}
