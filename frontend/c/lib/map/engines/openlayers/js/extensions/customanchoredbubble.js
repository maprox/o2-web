/*
 * Собственный Popup для рисования подписей к устройствам
 */
if (C.utils.isset('C.lib.map.openlayers.Extender')) {
	C.lib.map.openlayers.Extender.add(function() {

		if (!C.utils.isset('OpenLayers.Popup')) {
			console.warn('OpenLayers.Popup is not defined!');
			return;
		}

		if (!C.utils.isset('OpenLayers.Popup.FramedCloud')) {
			console.warn('OpenLayers.Popup.FramedCloud is not defined!');
			return;
		}

		OpenLayers.Popup.AutoSizeFramedCloud =
			OpenLayers.Class(OpenLayers.Popup.FramedCloud, {
				'autoSize': true,
				'panMapIfOutOfView': false,
				'displayClass': 'popupFramedCloud',

				show: function() {
					if (!OpenLayers.Element.visible(this.div)) {
						OpenLayers.Element.toggle(this.div);
					}
				},
				hide: function() {
					if (OpenLayers.Element.visible(this.div)) {
						OpenLayers.Element.toggle(this.div);
					}
				},
				initialize:function(id, lonlat, contentSize, contentHTML, anchor, closeBox,
					closeBoxCallback) {
						this.imageSrc = OpenLayers.Util.getImagesLocation() +
							'cloud-popup-relative.png';
						OpenLayers.Popup.Framed.prototype.initialize.apply(this, arguments);
						this.contentDiv.className = this.contentDisplayClass;
						this.positionBlocks.tl.offset = new OpenLayers.Pixel(54, 12);
						this.positionBlocks.tr.offset = new OpenLayers.Pixel(-54, 12);
						this.positionBlocks.bl.offset = new OpenLayers.Pixel(54, -12);
						this.positionBlocks.br.offset = new OpenLayers.Pixel(-54, -12);
						//register popupclosed event
						this.events = new OpenLayers.Events(this);
				},
				addCloseBox: function(callback) {
					this.closeDiv = OpenLayers.Util.createDiv(
						this.id + "_close", null, new OpenLayers.Size(17, 17)
						);
					this.closeDiv.className = "olPopupCloseBox";
					var contentDivPadding = this.getContentDivPadding();
					this.closeDiv.style.right = contentDivPadding.right + "px";
					this.closeDiv.style.top = contentDivPadding.top + "px";
					this.groupDiv.appendChild(this.closeDiv);
					var closePopup = callback || function(e) {
						this.hide();
						this.events.triggerEvent('popupclosed', {});
						OpenLayers.Event.stop(e);
					};
					OpenLayers.Event.observe(this.closeDiv, "click",
						OpenLayers.Function.bindAsEventListener(closePopup, this));
				},
				/**
				* Method: calculateNewPx
				* Besides the standard offset as determined by the Anchored class, our
				*     Framed popups have a special 'offset' property for each of their
				*     positions, which is used to offset the popup relative to its anchor.
				*
				* Parameters:
				* px - {<OpenLayers.Pixel>}
				*
				* Returns:
				* {<OpenLayers.Pixel>} The the new px position of the popup on the screen
				*     relative to the passed-in px.
				*/
				calculateNewPx:function(px) {
					this.anchor.offset.x = Math.round(-this.anchor.size.w / 2);
					this.anchor.offset.y = Math.round(-this.anchor.size.h / 2);

					var newPx = OpenLayers.Popup.Anchored.prototype.calculateNewPx.apply(
						this, arguments
					);

					newPx = newPx.offset(this.positionBlocks[this.relativePosition].offset);

					return newPx;
				}
			}
		);
	});
}

if (C && C.lib && C.lib.map && C.lib.map.openlayers && C.lib.map.openlayers.Extender) {
	C.lib.map.openlayers.Extender.add(function() {
		if (!C.utils.isset('OpenLayers.Popup')) {
			console.warn('OpenLayers.Popup is not defined!');
			return;
		}

		if (!C.utils.isset('OpenLayers.Popup.AnchoredBubble')) {
			console.warn('OpenLayers.Popup.AnchoredBubble is not defined!');
			return;
		}

		OpenLayers.Popup.CustomAnchoredBubble =
			OpenLayers.Class(OpenLayers.Popup.Anchored, {
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
						newPx.y += ( - this.anchor.size.h * 2 );
						newPx.x += ( this.anchor.size.w * 1.5 );
						break;
					case "left": //Слева - по умолчанию
					default: //По умолчанию ставим слева
						newPx.y += ( - this.anchor.size.h * 2 );
						newPx.x += ( -size.w - this.anchor.size.w );
						break;
				}

				return newPx;
			},

			getCornersToRound: function() {
				var corners = ['tl', 'tr', 'bl', 'br'];
				return corners.join(" ");
			},

			CLASS_NAME: "OpenLayers.Popup.CustomAnchoredBubble"
		});
	});
}
