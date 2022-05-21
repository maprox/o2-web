/*
 * Собственный Popup для рисования подписей к устройствам
 */

if (C.utils.isset('C.lib.map.openlayers.Extender')) {
	C.lib.map.openlayers.Extender.add(function() {

		if (!C.utils.isset('OpenLayers.Popup')) {
			console.warn('OpenLayers.Popup is not defined!');
			return;
		}

		if (!C.utils.isset('OpenLayers.Popup.AnchoredBubble')) {
			console.warn('OpenLayers.Popup.AnchoredBubble is not defined!');
			return;
		}

		OpenLayers.Popup.SimpleMapLabel =
			OpenLayers.Class(OpenLayers.Popup.AnchoredBubble, {
			//Размеры
			'autoSize': true,
			//'minSize': new OpenLayers.Size(0, 0),

			/*
			 * Вычисление позиции попапа
			 */
			calculateNewPx: function(px) {
				var newPx = px.offset(this.anchor.offset);
				//use contentSize if size is not already set
				var size = this.size || this.contentSize;

				switch (this.position) {
					case "top":
						newPx.y += ( -size.h + this.anchor.size.h / 2 );
						newPx.x += ( -size.w / 2 + this.anchor.size.w / 2 );
						break;
					case "bottom":
						newPx.y += ( this.anchor.size.h * 1.5 );
						newPx.x += ( -size.w / 2 + this.anchor.size.w / 2 );
						break;
					case "right":
						//newPx.y += ( - this.anchor.size.h * 2 );
						newPx.x += ( this.anchor.size.w * 1.5 );
						break;
					case "left": //Слева - по умолчанию
					default: //По умолчанию ставим слева
						//newPx.y += ( - this.anchor.size.h * 2 );
						newPx.x += ( -size.w - this.anchor.size.w );
						break;
				}
				return newPx;
			},

			getCornersToRound: function() {
				return ['tl', 'tr', 'bl', 'br'];
			},

			CLASS_NAME: "OpenLayers.Popup.SimpleMapLabel"
		});
	});
}
