/*
 * Собственный Handler рисования прямоугольника при помощи OpenLayers
 * Каждая точка ставится по двойному клику
 */
if (C.utils.isset('C.lib.map.openlayers.Extender')) {
	C.lib.map.openlayers.Extender.add(function() {
		OpenLayers.Handler.CustomPolygon =
			OpenLayers.Class(OpenLayers.Handler.Point, {
			line: null,
			initialize: function(control, callbacks, options) {
				OpenLayers.Handler.Point.prototype.initialize.apply(this, arguments);
			},
			createFeature: function(pixel) {
				var lonlat = this.control.map.getLonLatFromPixel(pixel);
				this.point = new OpenLayers.Feature.Vector(
					new OpenLayers.Geometry.Point(lonlat.lon, lonlat.lat)
					);
				this.line = new OpenLayers.Feature.Vector(
					new OpenLayers.Geometry.LinearRing([this.point.geometry])
					);
				//this.callback("create", [this.point.geometry, this.getSketch()]);
				this.point.geometry.clearBounds();
				this.layer.addFeatures([this.line, this.point], {
					silent: true
				});
			},
			destroyFeature: function() {
				OpenLayers.Handler.Point.prototype.destroyFeature.apply(this);
				this.line = null;
			},
			removePoint: function() {
				if(this.point) {
					this.layer.removeFeatures([this.point]);
				}
			},
			addPoint: function(pixel) {
				this.layer.removeFeatures([this.point]);
				var lonlat = this.control.map.getLonLatFromPixel(pixel);
				this.point = new OpenLayers.Feature.Vector(
					new OpenLayers.Geometry.Point(lonlat.lon, lonlat.lat)
					);
				this.line.geometry.addComponent(
					this.point.geometry, this.line.geometry.components.length
					);
				this.callback("point", [this.point.geometry, this.getGeometry()]);
				this.callback("modify", [this.point.geometry, this.getSketch()]);
				this.drawFeature();
			},
			modifyFeature: function(pixel) {
				var lonlat = this.control.map.getLonLatFromPixel(pixel);
				this.point.geometry.x = lonlat.lon;
				this.point.geometry.y = lonlat.lat;
				this.callback("modify", [this.point.geometry, this.getSketch()]);
				this.point.geometry.clearBounds();
				this.drawFeature();
			},
			drawFeature: function() {
				this.layer.drawFeature(this.line, this.style);
				this.layer.drawFeature(this.point, this.style);
			},
			getSketch: function() {
				return this.line;
			},
			getGeometry: function() {
				var geometry = this.line && this.line.geometry;
				if(geometry && this.multi) {
					geometry = new OpenLayers.Geometry.MultiPolygon([geometry]);
				}
				return geometry;
			},
			/*------------------------------*/
			/*
	 * Эти обработчики событий лучше не трогать, т.к. без них работает неправильно
	 * а чтобы работало правильно, придется лезть еще глубже в код OpenLayers
	 */
			mousedown: function(evt) {},
			mousemove: function (evt) {},
			mouseup: function (evt) {},
			/*
	 * Добавляем вершину по двойному клику
	 */
			dblclick: function(evt) {
				if (this.lastDown && this.lastDown.equals(evt.xy)) {
					return false;
				}
				if(this.lastDown == null) {
					if(this.persist) {
						this.destroyFeature();
					}
					this.createFeature(evt.xy);
				}
				else {
					if((this.lastUp == null) || !this.lastUp.equals(evt.xy)) {
						this.addPoint(evt.xy);
					}
				}
				this.mouseDown = true;
				this.lastDown = evt.xy;
				this.drawing = true;
				this.mouseDown = false;
				if (this.control) {
					this.control.editMode(true);
				}
				this.callback('point');
				if(this.drawing) {
					if(this.lastUp == null) {
						//this.addPoint(evt.xy);
					}
					this.lastUp = evt.xy;
					return false;
				}
				return false;
			},

			CLASS_NAME: "OpenLayers.Handler.CustomPolygon"
		});
	});
}
