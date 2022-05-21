/**
 * @fileOverview Layer list panel
 */
/**
 * @class M.lib.map_engines.openlayers.LayerList
 * @extends Ext.dataview.List
 */
Ext.define('C.lib.map.openlayers.LayerList', {

/**
	* Creates layer store
	*/
	createStore: function() {
		return new Ext.data.Store({
			model: 'C.model.OpenLayersLayer',
			sorters: 'zindex',
			autoLoad: false,
			proxy: {
				type: 'memory'
			}
		})
	},

/**
	* Initializes switcher and activate event
	*/
	initListeners: function() {
		this.addListener('layerswitched', this.onSwitch, this);
		this.addListener(this.activateEventName, this.changeLayer, this);
	},

/**
	* Performs actual layer change. Stub, needs to be redefined by child
	*/
	changeLayer: Ext.emptyFn,

/**
	* Actions to perform after switchong layer. Stub, needs to be redefined by child
	*/
	onSwitch: Ext.emptyFn,

/**
	* Updating of a #map variable
	* @param {Object} newMap
	* @param {Object} oldMap
	*/
	updateMap: function(newMap, oldMap) {
		var store = this.getStore();
		store.loadData(this.getLayersData(newMap));
		if (newMap.events && newMap.events.on) {
			if (oldMap && oldMap.events && oldMap.events.on) {
				oldMap.events.un({
					changelayer: this.onChangeLayer,
					scope: this
				});
			}
			newMap.events.on({
				changelayer: this.onChangeLayer,
				scope: this
			});
			this.select(this.findLayerRecord(newMap.baseLayer));
		}
	},

/**
	* Returns data of current available layers for the map
	* @param {Object} map
	*/
	getLayersData: function(map) {
		var data = [];
		if (!map.layers) { return data; }
		Ext.each(map.layers, function(layer){
			if (layer.displayInLayerSwitcher === true) {
				var visibility = layer.isBaseLayer ?
					(map.baseLayer == layer) : layer.getVisibility();
				data.push({
					id: layer.id,
					name: layer.name,
					visibility: visibility,
					zindex: layer.getZIndex()
				});
			}
		});
		return data;
	},

/**
	* Returns record for a layer object
	* @param {Object} layer
	* @return {Ext.model.Record}
	*/
	findLayerRecord: function(layer) {
		var found = null;
		this.getStore().each(function(record){
			if (record.get("id") === layer.id) {
				found = record;
			}
		}, this);
		return found;
	},

/**
	* Handler of changing layer
	* @param {Object} evt Event object
	*/
	onChangeLayer: function(evt) {
		if (evt.property == "visibility") {
			var record = this.findLayerRecord(evt.layer);
			record.set("visibility", evt.layer.getVisibility());
			this.fireEvent('layerswitched', evt.layer);
		}
	}
});
