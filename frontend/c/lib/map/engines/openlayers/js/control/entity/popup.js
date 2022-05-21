/**
 * @class C.lib.map.openlayers.entity.Popup
 * @extends C.lib.map.openlayers.entity.abstract.Point
 */

Ext.define('C.lib.map.openlayers.entity.Popup', {
	extend: 'C.lib.map.openlayers.entity.abstract.Point',

	config: {
		/**
		 * @cfg {String} content
		 * HTML content
		 * @accessor
		 */
		content: '',
		/**
		 * @cfg {String} position
		 * Position of popup relating to lat and lon
		 * @accessor
		 */
		position: 'left',
		/**
		 * @cfg {String} ppClass
		 * popup class (OpenLayers.Popup.SimpleMapLabel)
		 * @accessor
		 */
		ppClass: 'bubble',
		/**
		 * @cfg {String} cssClass
		 * popup class (OpenLayers.Popup.SimpleMapLabel)
		 * @accessor
		 */
		cssClass: '',
		/**
		 * @cfg {Number} zindex
		 * Z-index for map
		 * @accessor
		 */
		zindex: 50000,
		/**
		 * @cfg {String} height
		 * popup css height
		 * @accessor
		 */
		cssHeight: 'auto',
		/**
		 * @cfg {Boolean} closeBox
		 * Show or not close popup box
		 * @accessor
		 */
		closeBox: false,
		/**
		 * @cfg {OpenLayers.Feature} feature
		 * Proxied feature
		 * @accessor
		 */
		feature: null
	},

	/**
	 * Moves point on map to LonLat
	 * @param {OpenLayers.LonLat} lonlat
	 */
	moveTo: function(lonlat) {
		var popup = this.getFeature().popup;
		popup.lonlat = lonlat;
		popup.updatePosition();
	},

	/**
	 * Creates entity
	 * @protected
	 */
	doCreate: function() {
		if (!C.lib.map.openlayers.Extender.isLoaded()) {
			C.lib.map.openlayers.Extender.recreate();
		}

		var ft = new OpenLayers.Feature(this.getLayer(), this.getLonLat(), {
			popupContentHTML: this.getContent(),
			overflow: "hidden"
		});

		ft.popupClass = this.getPopupClass();
		ft.closeBox = this.getCloseBox();

		ft.createMarker();
		ft.createPopup(this.getCloseBox());
		ft.popup.position = this.getPosition();
		ft.popup.div.className += ' ' + this.getCssClass();
		ft.popup.div.style.height = this.getCssHeight();

		this.setFeature(ft);
	},

	/**
	 * Returns associated OpenLayers.Popup subclass
	 * @return {OpenLayers.Popup}
	 */
	getPopupClass: function() {
		var types = {
			bubble: OpenLayers.Popup.CustomAnchoredBubble,
			label: OpenLayers.Popup.SimpleMapLabel,
			framedCloud: OpenLayers.Popup.AutoSizeFramedCloud,
			tooltip: OpenLayers.Popup.SimpleTooltip
		};
		return types[this.getPpClass()] ? types[this.getPpClass()] :
			types.bubble;
	},

	addClickListener: function(fn, scope, data) {
		var popup = this.getFeature().popup;
		OpenLayers.Event.observe(popup.contentDiv, "click",
			OpenLayers.Function.bindAsEventListener(function(event) {
				fn.call(scope, event, this, data);
			}, this));
	},

	/**
	 * Displays entity on map
	 * @protected
	 */
	doShow: function() {
		var popup = this.getFeature().popup;

		popup.show();
		this.getMap().addPopup(popup, false);

		this.fixPopupSizeInViewport(popup);
	},

	/**
	 * Applies given zindex to element
	 */
	setElZindex: function() {
		var popup = this.getFeature().popup;
		popup.div.style.zIndex = this.getZindex();
	},

	/**
	 * Update popup size
	 */
	update: function() {
		var feature = this.getFeature();
		if (feature) {
			feature.popup.updateSize();
		}
	},

	/**
	 * Hides entity from view
	 * @protected
	 */
	doHide: function() {
		if (this.getFeature()) {
			var popup = this.getFeature().popup;
			this.getMap().removePopup(popup);
			popup.hide();
		}
	},

	/**
	 * Исправляет рассчитанный размер попапа, позволяя ему вылезти за пределы области видимости.
	 * @param {OpenLayers.Popup} popup Попап, подлежащий пересчету
	 */
	fixPopupSizeInViewport: function(popup) {
		var preparedHTML = "<div class='" + popup.contentDisplayClass+ "'>" +
			popup.contentDiv.innerHTML +
			"</div>";

		var containerElement = (popup.map) ? popup.map.div
			: document.body;

		var realSize = OpenLayers.Util.getRenderedDimensions(
			preparedHTML, null,	{
				displayClass: popup.displayClass,
				containerElement: containerElement
			}
		);

		popup.setSize(realSize, true);
	},

	/**
	 * Destroys entity
	 */
	destroy: function() {
		this.doHide();
		if (this.getFeature()) {
			this.getFeature().destroy();
			this.setFeature(null);
		}
		this.callParent(arguments);
	}
});

