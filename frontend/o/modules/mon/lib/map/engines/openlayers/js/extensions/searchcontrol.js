/*
 * Control for search by address action
 *
 */
if (C.utils.isset('C.lib.map.openlayers.Extender')) {
	C.lib.map.openlayers.Extender.add(function() {
		OpenLayers.Control.SearchControl = OpenLayers.Class(
			OpenLayers.Control, {
				initialize: function(handler, options) {
					OpenLayers.Control.prototype.initialize.apply(this, [options]);
				},

/**
	* Control activation
	*/
				activate: function () {
					if (this.active) return;
					OpenLayers.Control.prototype.activate.apply(this);
					var editDiv = document.createElement('div');
					this.editDiv = editDiv;
					this.map.viewPortDiv.appendChild(editDiv);
					OpenLayers.Element.addClass(editDiv, 'olSearchBox');
					//editDiv.style.zIndex = 10000;
					var input = document.createElement('input');
					this.input = input;
					editDiv.appendChild(input);
					var me = this;
					OpenLayers.Event.observe(editDiv,
						'keypress',
						function() { return me.textBoxKeyPress.apply(me, arguments); }
					);
				},

/**
	* Control deactivation
	*/
				deactivate: function() {
					OpenLayers.Control.prototype.deactivate.apply(this);
					if (this.editDiv) {
						this.map.viewPortDiv.removeChild(this.editDiv);
						this.editDiv = null;
					}
				},

/**
	* Keypress event handler (ENTER)
	*/
				textBoxKeyPress: function(evt) {
					if (evt.keyCode != OpenLayers.Event.KEY_RETURN) {
						return;
					}
					this.events.triggerEvent('textentered', {
							text: this.input.value
					});
				},

				CLASS_NAME: "OpenLayers.Control.SearchControl"
		});

	});
}
