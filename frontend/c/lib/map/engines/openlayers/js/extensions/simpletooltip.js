/**
 * @class OpenLayers.Popup.SimpleTooltip
 * @extends OpenLayers.Popup.AnchoredBubble
 */
if (C.utils.isset('C.lib.map.openlayers.Extender')) {
	C.lib.map.openlayers.Extender.add(function() {

		if (!C.utils.isset('OpenLayers.Popup.AnchoredBubble')) {
			console.warn('OpenLayers.Popup.AnchoredBubble is not defined!');
			return;
		}

		OpenLayers.Popup.AnchoredBubble.CORNER_SIZE = 0;
		OpenLayers.Popup.SimpleTooltip = OpenLayers.Class(
			OpenLayers.Popup.AnchoredBubble,
		{
			// sizes
			'autoSize': true,

			/**
			 * Popup position calculation
			 * @param {Object} px
			 * @return {Object}
			 */
			calculateNewPx: function(px) {
				var newPx = px.offset(this.anchor.offset);
				var size = this.size || this.contentSize;
				newPx.y += ( -size.h / 2 - 20 );
				newPx.x += ( -size.w / 2 - 15 );
				return newPx;
			},

			/**
			 * Returns corners HTML
			 * @return {String}
			 */
			getCornersToRound: function() {
				var corners = ['tl', 'tr', 'bl', 'br'];
				return corners.join(" ");
			},

			/**
			 * Class name for this control
			 * @type String
			 * @protected
			 */
			CLASS_NAME: "OpenLayers.Popup.SimpleTooltip"
		});

	});
}
