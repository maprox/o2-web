/**
 * @fileOverview Layer list panel
 */
/**
 * @class M.lib.map_engines.openlayers.LayerList
 * @extends Ext.dataview.List
 */
Ext.define('M.lib.map_engines.openlayers.LayerList', {
	alias: 'widget.layerlist',
	extend: 'Ext.dataview.List',
	mixins: {
		layerList: 'C.lib.map.openlayers.LayerList'
	},

/**
	* Name of event, whish activates the selection
	* @param {String}
	*/
	activateEventName: 'itemtap',

/** CONFIG */
	config: {
		modal: true,
		width: 200,
		top: '20%',
		bottom: '20%',
		right: '5%',

		/**
		 * @cfg {Object} map
		 * The wrapped map.
		 * @accessor
		 */
		map: null,

		/**
		 * @cfg {Boolean} hideOnSelect
		 * Hide this panel if layer is selected
		 */
		hideOnSelect: true,

		/**
		 * @cfg {Boolean} hideOnMaskTap
		 * Hide this panel on mask tap
		 */
		hideOnMaskTap: true
	},

/**
	* @constructor
	*/
	initialize: function() {
		this.setItemTpl(new Ext.XTemplate(
			'{name}'
		));
		this.callParent(arguments);

		this.setStore(this.createStore());
		this.initListeners();
	},

/**
	* Returns true, if layer switcher list is currently being displayed
	* Because mobile version masks everything else while layer selection is in process,
	* then when this is called, there is no chance that list is visible.
	*/
	isListDisplayed: function() {
		return false;
	},

/**
	* Displays layer list
	*/
	displayList: function(owner) {
		this.showBy(owner);
	},

/**
	* Hides layer list
	*/
	hideList: Ext.emptyFn,

/**
	* Performs actual layer change. Called on event defined by activateEventName
	*/
	changeLayer: function(object, index) {
		var map = this.getMap();
		var record = object.getStore().getAt(index);

		var layer = map.getLayersBy("id", record.get("id"))[0];
		if (layer.isBaseLayer) {
			map.setBaseLayer(layer);
		} else {
			layer.setVisibility(!layer.getVisibility());
		}
		record.set("visibility", layer.getVisibility());
	},

/**
	* Actions to perform after switchong layer.
	*/
	onSwitch: function() {
		if (this.getHideOnSelect()) {
			this.hide();
		}
	}
});
