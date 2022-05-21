/**
 * @class C.lib.map.openlayers.Engine
 */
C.utils.inherit('C.lib.map.openlayers.Engine', {

/**
	* @construct
	*/
	initialize: function() {
		this.callParent(arguments);
		this.initParameters();
	},

/**
	* Map rendering
	* @private
	*/
	renderMap: function() {
		C.lib.map.openlayers.Extender.recreate();
		var element = this.element;
		if (element.dom.firstChild) {
			Ext.fly(element.dom.firstChild).destroy();
		}
		this.createMap(element.id);
	},

/**
	* Creates control toolbar
	*/
	getControls: function() {
		var controls = [];
		if (OpenLayers.Control.Attribution) {
			controls.push(new OpenLayers.Control.Attribution());
		}
		if (OpenLayers.Control.Navigation) {
			controls.push(new OpenLayers.Control.Navigation({
				dragPanOptions: {
					enableKinetic: true
				}
			}));
		}
		if (OpenLayers.Control.TouchZoomPanel) {
			controls.push(new OpenLayers.Control.TouchZoomPanel());
		}
		if (OpenLayers.Control.LayerPanel) {
			controls.push(new OpenLayers.Control.LayerPanel());
		}
		return controls;
	}
});
