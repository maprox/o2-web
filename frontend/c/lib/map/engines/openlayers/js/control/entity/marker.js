/**
 * @class C.lib.map.openlayers.entity.Marker
 * @extends C.lib.map.openlayers.entity.abstract.Point
 */

Ext.define('C.lib.map.openlayers.entity.Marker', {
	extend: 'C.lib.map.openlayers.entity.abstract.Point',

	config: {
		/**
		 * @cfg {String} img
		 * Image id string
		 * @accessor
		 */
		img: 'default',
		/**
		 * @cfg {Number} offsetX
		 * @accessor
		 */
		offsetX: 0,
		/**
		 * @cfg {Number} offsetY
		 * @accessor
		 */
		offsetY: 0,
		/**
		 * @cfg {O.mon.model.Packet|null} packet
		 * Associated packet object. Not required
		 * @accessor
		 */
		packet: null,
		/**
		 * @cfg {Ext.Component} launcher
		 * Component firing events associated with marker
		 * @accessor
		 */
		launcher: null,
		/**
		 * @cfg {Boolean} doPopup
		 * Display popup on click
		 * @accessor
		 */
		doPopup: false,
		/**
		 * @cfg {Boolean} isDevice
		 * Is device marker
		 * @accessor
		 */
		isDevice: false,
		/**
		 * @cfg {OpenLayers.Marker} marker
		 * Proxied marker
		 * @accessor
		 */
		marker: null
	},

	/**
	 * @constructs
	 * @param {Object} config Объект конфигурации
	 */
	constructor: function(config) {
		if (config.packet && !config.longitude && !config.lon) {
			config.longitude = config.packet.longitude;
		}
		if (config.packet && !config.latitude && !config.lat) {
			config.latitude = config.packet.latitude;
		}

		this.callParent(arguments);

		return this;
	},

	/**
	 * Moves point on map to LonLat
	 * @param {OpenLayers.LonLat} lonlat
	 */
	moveTo: function(lonlat) {
		var newPx = this.getMap().getLayerPxFromLonLat(lonlat);
		this.getMarker().moveTo(newPx);
	},

	/**
	 * Creates entity
	 * @protected
	 */
	doCreate: function() {
		var img = C.lib.map.openlayers.Images.getImage(
			this.getImg(), {x: this.getOffsetX(), y: this.getOffsetY});

		var marker = new OpenLayers.Marker(this.getLonLat(), img);

		var fnMarkerClick = Ext.bind(this.onMarkerClick, this, [marker]);
		marker.events.register("click", this.getLayer(), fnMarkerClick);
		marker.events.register("touchend", this.getLayer(), fnMarkerClick);

		this.setMarker(marker);
	},

	/**
	 * Отклик на нажатие кнопки мыши по маркеру
	 */
	onMarkerClick: function() {
		if (this.getLauncher()) {
			this.getLauncher().fireEvent('selectpacket', this);
		}
	},

	/**
	 * Displays entity on map
	 * @protected
	 */
	doShow: function() {
		this.getLayer().addMarker(this.getMarker());
	},

	/**
	 * Applies given zindex to element
	 */
	setElZindex: function() {
		var icon = this.getMarker().icon;
		icon.imageDiv.style.zIndex = this.getZindex();
	},

	/**
	 * Hides entity from view
	 * @protected
	 */
	doHide: function() {
		if (this.getMarker()) {
			this.getLayer().removeMarker(this.getMarker());
		}
	},

	/**
	 * Destroys entity
	 */
	destroy: function() {
		if (this.getMarker()) {
			this.doHide();
			this.getMarker().destroy();
			this.setMarker(null);
		}
		this.setPacket(null);
		this.setLauncher(null);
		this.callParent(arguments);
	}
});