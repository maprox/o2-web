/**
 * @class C.lib.map.openlayers.entity.abstract.Base
 * @extends Ext.AbstractComponent
 */

Ext.define('C.lib.map.openlayers.entity.abstract.Base', {
	// @TODO When config starts working properly in Ext.Base, switch to extending Ext.Base
	extend: 'Ext.AbstractComponent',
	alias: 'widget.mapentity',

	mixins: ['C.lib.map.openlayers.Util'],

	config: {
		/**
		 * @cfg {OpenLayers.Map} map
		 * Link to map object
		 * @accessor
		 */
		map: null,
		/**
		 * @cfg {OpenLayers.Layer|null} layer
		 * Link to associated layer
		 * @accessor
		 */
		layer: null,
		/**
		 * @cfg {Boolean} created
		 * Is item created
		 * @accessor
		 */
		created: false,
		/**
		 * @cfg {Number} zindex
		 * Z-index for map
		 * @accessor
		 */
		zindex: 0,
		/**
		 * @cfg {Boolean} displayed
		 * Is item displayed
		 * @accessor
		 */
		displayed: false
	},

	/**
	 * Checks, if entity is inside given bounds
	 * @param {OpenLayers.Bounds} bounds
	 */
	insideBounds: function(bounds) {
		console.error('Function "insideBounds" not implemented!');
		return false;
	},

	/**
	 * Checks, if entity is inside current viewport
	 */
	onMap: function() {
		return this.insideBounds(this.getMap().getExtent());
	},

	/**
	 * Displays entity on map
	 */
	create: function() {
		if (!this.getCreated()) {
			this.setCreated(true);
			this.doCreate();
		}
	},

	/**
	 * Creates entity
	 * @protected
	 */
	doCreate: function() {
		console.error('Function "doCreate" not implemented!');
	},

	/**
	 * Reserved for update actions
	 */
	update: Ext.emptyFn,

	/**
	 * Displays entity on map
	 */
	show: function() {
		if (!this.getDisplayed()) {
			this.setDisplayed(true);
			// Ensure that entity is created
			this.create();
			this.doShow();
			if (this.getZindex()) {
				this.setElZindex();
			}
		}
	},

	/**
	 * Applies given zindex to element
	 */
	setElZindex: Ext.emptyFn,

	/**
	 * Displays entity on map
	 * @protected
	 */
	doShow: function() {
		console.error('Function "doShow" not implemented!');
	},

	/**
	 * Displays entity on map
	 */
	hide: function() {
		if (this.getDisplayed()) {
			this.setDisplayed(false);
			this.doHide();
		}
	},

	/**
	 * Hides entity from view
	 * @protected
	 */
	doHide: function() {
		console.error('Function "doHide" not implemented!');
	},

	/**
	 * Destroys entity
	 */
	destroy: function() {
		this.setMap(null);
		this.setLayer(null);
		this.callParent(arguments);
	}
});
