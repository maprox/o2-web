/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt
 * for the full text of the license. */


/**
 * Move a feature with a drag.
 *
 * @class
 * @requires OpenLayers/Control.js
 * @requires OpenLayers/Handler/Drag.js
 * @requires OpenLayers/Handler/Feature.js
 */

if (C.utils.isset('C.lib.map.openlayers.Extender')) {

	C.lib.map.openlayers.Extender.add(function() {
		OpenLayers.Handler.Marker =
			OpenLayers.Class(OpenLayers.Handler.Feature, {

			/**
			 * Trigger the appropriate callback if a marker is under the mouse.
			 *
			 * @param {String} type Callback key
			 * @type {Boolean} A marker was selected
			 */
			handle: function(evt) {
				var node = OpenLayers.Event.element(evt);
				var feature = null;
				var type = evt.type;
				for (var i = 0; i < this.layer.markers.length; i++) {
					if (this.layer.markers[i].icon != undefined &&
						this.layer.markers[i].icon.imageDiv.firstChild == node) {

						feature = this.layer.markers[i];
						break;
					}
				}
				var selected = false;
				if (feature) {
					if(this.geometryTypes == null) {
						// over a new, out of the last and over a new, or still on the last
						if(!this.feature) {
							// over a new feature
							this.callback('over', [feature]);
						} else if(this.feature != feature) {
							// out of the last and over a new
							this.callback('out', [this.feature]);
							this.callback('over', [feature]);
						}
						this.feature = feature;
						this.callback(type, [feature]);
						selected = true;
					} else {
						if(this.feature && (this.feature != feature)) {
							// out of the last and over a new
							this.callback('out', [this.feature]);
							this.feature = null;
						}
						selected = false;
					}
				} else {
					if(this.feature) {
						// out of the last
						this.callback('out', [this.feature]);
						this.feature = null;
					}
					selected = false;
				}
				return selected;
			},

			/** @final @type String */
			CLASS_NAME: "OpenLayers.Handler.Marker"
		});
	});

	C.lib.map.openlayers.Extender.add(function() {
		OpenLayers.Control.DragMarker =
			OpenLayers.Class(OpenLayers.Control.DragFeature, {

			/**
			 * @param {OpenLayers.Layer.Vector} layer
			 * @param {Object} options
			 */
			initialize: function(layer, options) {
				OpenLayers.Control.prototype.initialize.apply(this, [options]);
				this.layer = layer;
				this.dragCallbacks = OpenLayers.Util.extend({down: this.downFeature,
															 move: this.moveFeature,
															 up: this.upFeature,
															 out: this.cancel,
															 done: this.doneDragging
															}, this.dragCallbacks);
				this.dragHandler = new OpenLayers.Handler.Drag(this, this.dragCallbacks);
				this.featureCallbacks = OpenLayers.Util.extend({over: this.overFeature,
																out: this.outFeature
															   }, this.featureCallbacks);
				var handlerOptions = {geometryTypes: this.geometryTypes};
				this.featureHandler = new OpenLayers.Handler.Marker(this, this.layer,
																this.featureCallbacks,
																handlerOptions);

				this.handlers = {
					drag: this.dragHandler,
					feature: this.featureHandler
				};
			},

			/**
			 * Called when the drag handler detects a mouse-move.  Also calls the
			 * optional onDrag method.
			 *
			 * @param {OpenLayers.Pixel} pixel
			 */
			moveFeature: function(pixel) {
				var px = this.feature.icon.px.add(pixel.x - this.lastPixel.x, pixel.y - this.lastPixel.y);;
				this.feature.moveTo(px);
				this.lastPixel = pixel;
				this.onDrag(this.feature, pixel);
			},

			/** @final @type String */
			CLASS_NAME: "OpenLayers.Control.DragMarker"
		});
	});
}
