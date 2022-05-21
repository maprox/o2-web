/**
 * @class OpenLayers.Control.TouchZoomOut
 * @extends OpenLayers.Control
 */
if (C.utils.isset('C.lib.map.openlayers.Extender')) {
	C.lib.map.openlayers.Extender.add(function() {

		OpenLayers.Control.TouchZoomOut = OpenLayers.Class(OpenLayers.Control, {
			/**
			 * Property: type
			 * {String} The type of <OpenLayers.Control> -- When added to a
			 *     <Control.Panel>, 'type' is used by the panel to determine how to
			 *     handle our events.
			 */
			type: OpenLayers.Control.TYPE_BUTTON,

			/**
			 * Method: draw
			 * Drawing of a control.
			 * Assign touchstart event.
			 */
			draw: function() {
				OpenLayers.Control.prototype.draw.apply(this, arguments);
				this.divEvents = new OpenLayers.Events(this, this.panel_div);
				this.divEvents.on({
					'touchstart': this.trigger,
					scope: this
				});
			},

			/**
			 * Handler function for the Control.
			 * ss: For some reasons @trigger method is called twice,
			 *     so we had to check arguments.length eq. 0
			 *    (first call has some arguments - dunno what they mean)
			 */
			trigger: function() {
				if (arguments.length == 0) {
					this.map.zoomOut();
				}
			},

			/**
			 * Class name for this control
			 */
			CLASS_NAME: "OpenLayers.Control.TouchZoomOut"
		});

	});
}
