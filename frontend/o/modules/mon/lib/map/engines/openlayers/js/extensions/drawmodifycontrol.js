/*
 * Selfmade Control for drawing and editing of OpenLayers features
 * Made from OpenLayers.Control.ModifyFeature
 * and OpenLayers.Control.DrawFeature
 *
 */
if (C.utils.isset('C.lib.map.openlayers.Extender')) {
	C.lib.map.openlayers.Extender.add(function() {
		OpenLayers.Control.DrawModifyFeature = OpenLayers.Class(
			OpenLayers.Control.ModifyFeature, {
/**
				* Property: callbacks
				* {Object} The functions that are sent to the handler for callback
				*/
				callbacks: null,

/**
				* APIProperty: multi
				* {Boolean} Cast features to multi-part geometries before passing to the
				*     layer.  Default is false.
				*/
				multi: false,

/**
				* APIProperty: featureAdded
				* {Function} Called after each feature is added
				*/
				featureAdded: function() {},

/**
				* APIProperty: handlerOptions
				* {Object} Used to set non-default properties on the control's handler
				*/
				handlerOptions: null,

/**
				* Constructor: OpenLayers.Control.ModifyFeature
				* Create a new modify feature control.
				*
				* Parameters:
				* layer - {<OpenLayers.Layer.Vector>} Layer that contains features that
				*     will be modified.
				* options - {Object} Optional object whose properties will be set on the
				*     control.
				*/
				initialize: function(layer, handler, options) {
					this.layer = layer;
					this.vertices = [];
					this.virtualVertices = [];
					this.virtualStyle = OpenLayers.Util.extend({},
						this.layer.style || this.layer.styleMap.createSymbolizer());
					this.virtualStyle.fillOpacity = 0.3;
					this.virtualStyle.strokeOpacity = 0.3;
					this.deleteCodes = [46, 68];
					this.mode = OpenLayers.Control.ModifyFeature.RESHAPE;
					OpenLayers.Control.prototype.initialize.apply(this, [options]);
					this.callbacks = OpenLayers.Util.extend({
						done: this.drawFeature,
						modify: function(vertex, feature) {
							this.layer.events.triggerEvent(
								"sketchmodified", {
									vertex: vertex,
									feature: feature
								});
						},
						create: function(vertex, feature) {
							this.layer.events.triggerEvent(
								"sketchstarted", {
									vertex: vertex,
									feature: feature
								}
								);
						}
					},
					this.callbacks
					);
					this.layer = layer;
					this.handlerOptions = this.handlerOptions || {};
					if (!("multi" in this.handlerOptions)) {
						this.handlerOptions.multi = this.multi;
					}
					var sketchStyle = this.layer.styleMap &&
					this.layer.styleMap.styles.temporary;
					if(sketchStyle) {
						this.handlerOptions.layerOptions = OpenLayers.Util.applyDefaults(
							this.handlerOptions.layerOptions,
							{
								styleMap: new OpenLayers.StyleMap({
									"default": sketchStyle
								})
							}
							);
					}
					//Задать цвет примитивов
					this.setColor(options.handlerOptions.style.fillColor);
					this.handler = new handler(this, this.callbacks, this.handlerOptions);
					//В Handlere сделать ссылку на Control
					this.handler.control = this;
					/*------------------------*/
					if(!(this.deleteCodes instanceof Array)) {
						this.deleteCodes = [this.deleteCodes];
					}
					var control = this;

					// configure the select control
					var selectOptions = {
						geometryTypes: this.geometryTypes,
						clickout: this.clickout,
						toggle: this.toggle,
						onBeforeSelect: this.beforeSelectFeature,
						onSelect: this.selectFeature,
						onUnselect: this.unselectFeature,
						scope: this
					};

					if(this.standalone === false) {
						this.selectControl = new OpenLayers.Control.SelectFeature(
							layer, selectOptions
							);
					}

					// configure the drag control
					var dragOptions = {
						geometryTypes: ["OpenLayers.Geometry.Point"],
						snappingOptions: this.snappingOptions,
						onStart: function(feature, pixel) {
							control.dragStart.apply(control, [feature, pixel]);
						},
						onDrag: function(feature, pixel) {
							control.dragVertex.apply(control, [feature, pixel]);
						},
						onComplete: function(feature) {
							var engine = this.map.observerEngine;
							control.dragComplete.apply(control, [feature]);
							engine.fireEvent('pointAdded', engine.getPointsArray());
						},
						featureCallbacks: {
							over: function(feature) {
								if(control.standalone !== true || feature._sketch ||
									control.feature === feature) {
									control.dragControl.overFeature.apply(
										control.dragControl, [feature]);
								}
							},
							dblclick: function(feature) {alert('1s')}
						}
					};
					this.dragControl = new OpenLayers.Control.CustomDragFeature(
						layer, dragOptions
						);
					this.dragControl.parentControl = this;
					// configure the keyboard handler
					var keyboardOptions = {
						keydown: this.handleKeypress
					};
					this.handlers = {
						keyboard: new OpenLayers.Handler.Keyboard(this, keyboardOptions)
					};
				},


/**
				* Удаление вершины vertex
				* Работает кривовато, но хоть как-то работает
				*/
				deleteFeature: function(vertex) {
					if(vertex &&
						OpenLayers.Util.indexOf(this.vertices, vertex) != -1 &&
						!this.dragControl.handlers.drag.dragging &&
						vertex.geometry.parent) {
						// remove the vertex
							var index = OpenLayers.Util.indexOf(this.vertices, vertex);
							this.vertices.slice(index, index + 1);
							this.virtualVertices.slice(index, index + 1);
							this.resetVertices();

						vertex.geometry.parent.removeComponent(vertex.geometry);
						this.layer.drawFeature(this.feature, this.standalone ?
							undefined :
							this.selectControl.renderIntent);
						this.resetVertices();
						this.setFeatureState();
						this.onModification(this.feature);
						this.layer.events.triggerEvent("featuremodified",
						{
							feature: this.feature
						});
					}
				},

/**
				* Удаляем вершины по двойному клику
				*/
				removeFeature: function(feature) {
					this.deleteFeature(this.dragControl.feature);
					this.deleteFeature(this.dragControl.feature);
				},

/*
				* Устанавливаем цвет рисуемого многоугольника, при необходимости
				* перерисовываем слои
				*/
				setColor: function(color) {
					OpenLayers.Feature.Vector.style.select.fillColor = color
					OpenLayers.Feature.Vector.style.select.strokeColor = color;
					OpenLayers.Feature.Vector.style.temporary.fillColor = color
					OpenLayers.Feature.Vector.style.temporary.strokeColor = color;
					if (this.handler) {
						if (this.handler.layer) {
							this.handler.layer.redraw();
						}
					}
					if (this.layer) {
						this.layer.redraw();
					}
				},

/*
				* Возвращает список нарисованных точек геозоны
				*/
				getPoints: function() {
					return this.vertices;
				},

/*
				* Включает режим редактирования фигуры
				*/
				editMode: function() {
					this.activate();
					this.selectFeature(this.handler.line);
					this.getPoints();

				},

/**
				* Method: drawFeature
				*/
				drawFeature: function(geometry) {
					var feature = new OpenLayers.Feature.Vector(geometry);
					var proceed = this.layer.events.triggerEvent(
						"sketchcomplete", {
							feature: feature
						});
					if(proceed !== false) {
						feature.state = OpenLayers.State.INSERT;
						this.layer.addFeatures([feature]);
						this.featureAdded(feature);
						this.events.triggerEvent("featureadded",{
							feature : feature
						});
					}
				},

				getMap: function() {
					return this.map;
				},

				CLASS_NAME: "OpenLayers.Control.DrawModifyFeature"
			});

			OpenLayers.Handler.CustomDrag = OpenLayers.Class(OpenLayers.Handler.Drag, {
				dblclick: function(evt) {
					this.callback("doubleclick", [evt]);
				}
			});
			OpenLayers.Control.CustomDragFeature =
			OpenLayers.Class(OpenLayers.Control.DragFeature,{
				initialize: function(layer, options) {
					OpenLayers.Control.prototype.initialize.apply(this, [options]);
					this.layer = layer;
					this.handlers = {
						drag: new OpenLayers.Handler.CustomDrag(
							this, OpenLayers.Util.extend({
								down: this.downFeature,
								move: this.moveFeature,
								up: this.upFeature,
								out: this.cancel,
								done: this.doneDragging,
								doubleclick: function() {
									this.parentControl.removeFeature();
								}
							}, this.dragCallbacks), {
								documentDrag: this.documentDrag
							}
							),
						feature: new OpenLayers.Handler.Feature(
							this, this.layer, OpenLayers.Util.extend({
								over: this.overFeature,
								out: this.outFeature
							}, this.featureCallbacks),
							{
								geometryTypes: this.geometryTypes
							}
							)
					};
				},

				CLASS_NAME: "OpenLayers.Control.CustomDragFeature"
			});

	});
}
