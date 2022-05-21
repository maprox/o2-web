/**
 * @fileOverview Layer list panel
 */
/**
 * @class O.lib.map_engines.openlayers.LayerList
 * @extends Ext.Panel
 */
C.define('O.lib.map_engines.openlayers.LayerList', {
	alias: 'widget.layerlist',
	extend: 'Ext.menu.Menu',
	mixins: {
		layerList: 'C.lib.map.openlayers.LayerList'
	},

	bodyCls: 'layer_list',
	items: [],
/**
	* Name of event, whish activates the selection
	* @param {String}
	*/
	activateEventName: 'click',

/** CONFIG */
	config: {
		/**
		 * @cfg {Object} map
		 * The wrapped map.
		 * @accessor
		 */
		map: null,
		/**
		 * @cfg {Object} store
		 * Store for menu items.
		 * @accessor
		 */
		store: null
	},

/**
	* @constructor
	*/
	initComponent: function(){
		this.callParent(arguments);
		this.setStore(this.createStore());
		this.getStore().on('datachanged', this.onStoreLoad, this);
		this.initListeners();
	},

/**
	* Returns true, if layer switcher list is currently being displayed
	*/
	isListDisplayed: function() {
		return this.isVisible(true);
	},

/**
	* Displays layer list
	*/
	displayList: function(owner) {
		this.showBy(owner, 'tr-tr?', [-48, 16]);
	},

/**
	* Hides layer list
	*/
	hideList: function() {
		this.hide();
	},

/**
	* Extjs don't have update accessor, lets call function manually when map is set
	* @param {Object} map
	*/
	setMap: function(map) {
		var oldMap = this.getMap();

		this.map = map;

		this.updateMap(map, oldMap);
	},

/**
	* Creates menu items on update
	* @param {Object} store
	*/
	onStoreLoad: function(store) {

		this.removeAll();

		var items = [];
		store.each(function(record) {
			items.push({
				boxLabel: record.get('name'),
				name: 'visibleLayer',
				inputValue: record.get('id'),
				checked: record.get('visibility')
			});
		});

		this.add({
			xtype: 'radiogroup',
			columns: 1,
			layout: 'fit',
			vertical: true,
			items: items
		});
	},

/**
	* Marks menu item as active
	* @param {Object} record
	*/
	select: function(record) {
		var id = record.get('id');
		this.child('radiogroup').setValue({visibleLayer: [id]});
	},

/**
	* Performs actual layer change. Called on event defined by activateEventName
	*/
	changeLayer: function(object, radiogroup) {
		var map = this.getMap(),
			id = radiogroup.getValue().visibleLayer,
			record = object.getStore().findRecord('id', id),
			layer = map.getLayersBy("id", id)[0];

		if (layer.isBaseLayer) {
			map.setBaseLayer(layer);
		} else {
			layer.setVisibility(!layer.getVisibility());
		}

		record.set("visibility", layer.getVisibility());
	},

/**
	* Actions to perform after switching layer.
	*/
	onSwitch: function(layer) {
		this.hide();
		C.lib.map.openlayers.Extender.fireEvent('switchlayer', layer);
	}
});
