/**
 * Panel for map layers
 * @class OpenLayers.Control.TouchZoomPanel
 * @extends OpenLayers.Control.Panel
 */
if (C.utils.isset('C.lib.map.openlayers.Extender')) {
	C.lib.map.openlayers.Extender.add(function() {

		OpenLayers.Control.TouchZoomPanel = OpenLayers.Class(
			OpenLayers.Control.Panel,
		{

			/**
			 * Constructor: OpenLayers.Control.LayerPanel
			 * Add the layer switcher controls.
			 *
			 * Parameters:
			 * options - {Object} An optional object whose properties will be used
			 *     to extend the control.
			 */
			initialize: function(options) {
				OpenLayers.Control.Panel.prototype.initialize.apply(this, [options]);
				var controls = [];
				if (OpenLayers.Control.TouchZoomIn) {
					controls.push(new OpenLayers.Control.TouchZoomIn());
				}
				if (OpenLayers.Control.TouchZoomOut) {
					controls.push(new OpenLayers.Control.TouchZoomOut());
				}
				this.addControls(controls);
			},

			/**
			 * Class name for this control
			 */
			CLASS_NAME: "OpenLayers.Control.TouchZoomPanel"
		});

	});
}
