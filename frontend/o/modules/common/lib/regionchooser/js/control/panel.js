/**
 * Region/Object chooser panel
 * Example:
<pre>
panel.selectRegions([
	'Самарская область',
	'Московская область',
	'Республика Саха (Якутия)',
	'Сахалинская область',
	'Хабаровский край'
]);
panel.selectRegion('Красноярский край');
panel.addObjects([{
	id: 1,
	name: 'Warehouse 1',
	lat: 53.3030,
	lon: 50.2034
}, {
	id: 2,
	name: 'Warehouse 2',
	lat: 63.3030,
	lon: 60.2034,
	marker: C.cfg.maps.yandex.markers.FACTORY
}]);
panel.selectObjects([1, 2]);
</pre>
 *
 * @class O.lib.panel.RegionChooser
 * @extends Ext.panel.Panel
 */
C.utils.inherit('O.lib.panel.RegionChooser', {

/**
	* @event selectionchange
	* Fires when array of selected regions is changed
	* @param {O.lib.panel.RegionChooser} this
	* @param {String[]} regionNames Array of region names
	*/
/**
	* @event select
	* Fires when region is selected
	* @param {O.lib.panel.RegionChooser} this
	* @param {String} regionName Name of the selected region
	*/
/**
	* @event deselect
	* Fires when object is unselected
	* @param {O.lib.panel.RegionChooser} this
	* @param {String} regionName Name of the region
	*/
/**
	* @event afterload
	* Fires when regions are loaded
	* @param {O.lib.abstract.GroupsList} this
	* @param {Object} data Loaded data
	*/

/*
	* Markers style aliases
	*/
	defaultMarkerIcon: C.cfg.maps.yandex.markers.WAREHOUSE,

/**
	* @constructs
	*/
	initComponent: function() {
		this.waitingForSelection = null;
		this.callOverridden();
		this.on({
			afterrender: 'onMapAfterRender',
			show: 'onResize',
			resize: 'onResize',
			scope: this
		});
		/*
		 * Collection of objects
		 * @type Ext.util.MixedCollection
		 */
		this.listOfObjects = new Ext.util.MixedCollection();
		this.selectedObjects = new Ext.util.MixedCollection();
		this.selectedObjects.on({
			add: 'onSelectedObjectCollectionAdd',
			remove: 'onSelectedObjectCollectionRemove',
			scope: this
		});
		/*
		 * Collection of selected regions
		 * @type Ext.util.MixedCollection
		 */
		this.selectedRegions = new Ext.util.MixedCollection();
		this.selectedRegions.on({
			add: 'onSelectedRegionCollectionAdd',
			remove: 'onSelectedRegionCollectionRemove',
			scope: this
		});
		this.on('afterload', function() {
			/*
			this.addObjects([{
				id: 1,
				name: 'Warehouse 1',
				lat: 53.3030,
				lon: 50.2034
			}, {
				id: 2,
				name: 'Warehouse 2',
				lat: 63.3030,
				lon: 60.2034,
				marker: C.cfg.maps.yandex.markers.FACTORY
			}]);
			this.selectObjects([1, 2]);
			this.selectRegions([
				'Самарская область',
				'Московская область',
				'Республика Саха (Якутия)',
				'Сахалинская область',
				'Хабаровский край'
			]);
			*/
		}, this);

		// Regions style
		this.selectedStyle = {
			fillColor: '#ff9e3f55',
			strokeColor: '#ff9e3f'
		};

		this.defaultStyle = {
			fillColor: '#ff9e3f00',
			strokeColor: '#ff9e3f00'
		};
	},

/**
	* Returns an array of selected regions
	* @return {String[]}
	*/
	getSelectedRegions: function() {
		return this.selectedRegions.getKeys();
	},

/**
	* Retuns an array of regions
	* @return {Object[]}
	*/
	getRegions: function() {
		var list = [];
		if (this.isLoaded()) {
			// For each region look if its name exists in the list array
			var index = 0;
			this.regionsCollection.forEach(function(region) {
				list.push({
					id: index++,
					name: region.properties.get('name')
				});
			}, this);
		}
		return list;
	},

/**
	* Returns an array of selected objects
	* @return {Number[]}
	*/
	getSelectedObjects: function() {
		return this.selectedObjects.getKeys();
	},

/**
	* Retuns an array of objects
	* @return {Object[]}
	*/
	getObjects: function() {
		return this.listOfObjects.getRange();
	},

/**
	* Adding region to the region collection
	* @param {Number} index
	* @param {Object} object
	* @param {String} key Region name
	* @protected
	*/
	onSelectedRegionCollectionAdd: function(index, object, key) {
		this.panelListRegions.checkByName(key);
		this.fireEvent('select', this, key);
		this.fireEvent('selectionchange', this, this.getSelectedRegions(),
			this.waitingForSelection !== null);
	},

/**
	* Removing region from the region collection
	* @param {Object} object
	* @param {String} key Region name
	* @protected
	*/
	onSelectedRegionCollectionRemove: function(object, key) {
		if (this.map) {
			this.map.geoObjects.remove(object);
		}
		this.panelListRegions.uncheckByName(key);
		this.fireEvent('deselect', this, key);
		this.fireEvent('selectionchange', this, this.getSelectedRegions(),
			this.waitingForSelection !== null);
	},

/**
	* Adding object to the selected objects collection
	* @param {Number} index
	* @param {Object} object
	* @protected
	*/
	onSelectedObjectCollectionAdd: function(index, object) {
		if (this.map) {
			// create placemark
			var point = [object.lon, object.lat];
			var placemark = new ymaps.Placemark(point, {
				hideIcon: false,
				style: object.marker || this.defaultMarkerIcon
			});
			placemark.name = object.name;
			placemark.description = object.address;
			// add placemark to the map
			this.map.geoObjects.add(placemark);
			object.placemark = placemark;
		}
	},

/**
	* Removing object from the selected objects collection
	* @param {Object} object
	* @protected
	*/
	onSelectedObjectCollectionRemove: function(object) {
		if (this.map && object.placemark) {
			this.map.geoObjects.remove(object.placemark);
			delete object.placemark;
		}
	},

/**
	* Actions, applied after map panel is rendered
	* @protected
	*/
	onMapAfterRender: function() {
		if (this.loadEngineOnRender) {
			this.initEngine(this.onEngineLoad);
		}
	},

/**
	* Component resize
	* @protected
	*/
	onResize: function() {
		if (this.map) {
			this.map.container.fitToViewport();
		}
	},

/**
	* Returns true if regions and map engine are loaded
	* @return {Boolean}
	*/
	isLoaded: function() {
		return (this.map && this.regionsCollection);
	},

/**
	* Loads engine
	*/
	loadEngine: function() {
		this.initEngine(this.onEngineLoad);
	},

/**
	* Inits map engine (Yandex)
	* @param {Function} callback
	* @param {Object} scope
	*/
	initEngine: function(callback, scope) {
		scope = scope || this;
		var me = this;
		me.lock();
		C.utils.loadScript(C.cfg.maps.yandex.url, function() {
			if (typeof(ymaps) !== "undefined") {
				ymaps.ready(function() {
					callback.call(scope, true);
					me.unlock();
				});
			} else {
				callback.call(scope, false, 'Error loading engine');
				me.unlock();
			}
		});
	},

/**
	* Load engine callback
	* @param {Boolean} success
	* @param {String} error
	* @protected
	*/
	onEngineLoad: function(success, error) {
		if (!success) { return; }
		var me = this;
		this.map = new ymaps.Map(
			this.panelMap.body.select('span div').elements[0].id,
		{
			center: [55.76, 37.64],
			zoom: 3,
			behaviors: ["default", "scrollZoom"]
		});

		this.map.controls.add('typeSelector')
			.add('mapTools')
			.add('zoomControl')
			.add('scaleLine');

		ymaps.regions.load('RU', {
			lang: 'ru',
			quality: 1
		}).then(function (result) {
			var regions = result.geoObjects;

			regions.options.set({
				zIndex: 99999,
				zIndexHover: 99999
			});

			me.initRegions(regions);

			regions.events.add('click', function (e) {
				var region = e.get('target');
				me.selectRegion(region);
			});

			me.initRegionsList();
			// objects initialization
			me.initObjectsList();
			me.fireEvent('afterload');

		}, function() {
			alert('No response');
		});
	},

/**
	* Regions initialization
	* @protected
	*/
	initRegions: function(regions) {
		var me = this;
		var map = this.map;

		// remember regions collection
		this.regionsCollection = regions;

		regions.options.set('hasBalloon', true);
		regions.options.set('hasHint', true);
		regions.options.set(this.defaultStyle);

		map.geoObjects.add(regions);

		// let's select regions if there was a request
		// to select regions during engine loading
		if (this.waitingForSelection) {
			this.selectRegions(this.waitingForSelection);
			this.waitingForSelection = null;
		}
	},

/**
	* Initialization of regionlist
	*/
	initRegionsList: function() {
		if (!this.showListPanel) { return; }
		this.panelList.show();
		var dataRegions = {}; // Ext.create('O.data.GroupedCollection');
		var regionListIds = [];
		var regions = this.getRegions();
		Ext.each(regions, function(region) {
			regionListIds.push(region.id);
		});
		dataRegions.objects = regions;
		//dataRegions.reloadCollections();
		this.panelListRegions.loadData(C.utils.virtualGroups.ALL,
			regionListIds, dataRegions, []);
		this.panelListRegions.on({
			// region select
			check: function(record) {
				this.selectRegion(record.get('name'));
			},
			// region deselect
			uncheck: function(record) {
				this.deselectRegion(record.get('name'));
			},
			scope: this
		});
	},

/**
	* Initialization of objects list
	*/
	initObjectsList: function() {
		// objects list initialization
		this.panelListObjects.on({
			// object select
			check: function(record) {
				var object = this.listOfObjects.getByKey(record.get('id'));
				this.selectedObjects.add(object);
			},
			// object deselect
			uncheck: function(record) {
				this.selectedObjects.removeAtKey(record.get('id'));
			},
			scope: this
		});
		// let's select objects if there was a request
		// to select objects during engine loading
		if (this.waitingForObjectSelection) {
			this.selectObjects(this.waitingForObjectSelection);
		}
	},

/**
	* Returns true if region is selected
	* @param {String} regionName Region name
	* @return {Boolean}
	*/
	isRegionSelected: function(regionName) {
		regionName = this.convertName(regionName);
		return this.selectedRegions.containsKey(
			regionName);
	},

/**
	* Returns true if object is selected
	* @param {Number} objectId Object identifier
	* @return {Boolean}
	*/
	isObjectSelected: function(objectId) {
		return this.selectedObjects.containsKey(objectId);
	},

/**
	* Deselects region by its name
	* @param {String} regionName
	*/
	deselectRegion: function(regionName) {

		regionName = this.convertName(regionName);

		if (this.isRegionSelected(regionName)) {
			var region = this.selectedRegions.get(regionName);
			this.selectedRegions.removeAtKey(regionName);
			region.options.set(this.defaultStyle);
		}
		if (!this.isLoaded()) {
			if (this.waitingForSelection) {
				var regions = [];
				for (var i = 0, l = this.waitingForSelection.length;
					i < l; i++) {
					if (this.waitingForSelection[i] != regionName) {
						regions.push(this.waitingForSelection[i]);
					}
				}
				this.waitingForSelection = regions;
			}
		}
	},

/**
	 * Converts region name
	 * TODO: kostili
	 * @param name
	 */
	convertName: function(name) {
		return name.toLowerCase().replace(/\s*\(.+\)\s*/, '')
			.replace(/республика\s+/, '').replace(/\s-\s.+/, '')
			.replace(/чувашия$/, 'чувашская республика')
			.replace(/северная осетия$/, 'северная осетия-алания');
	},

/**
	* Region selection by name or object
	* @param {Object|String} region Region object | Region name
	* @protected
	*/
	selectRegion: function(region) {
		// if the input param is string call selectRegionByName method
		if (Ext.isString(region)) {
			return this.selectRegionByName(region);
		}

		// checks if region is already selected
		if (this.isRegionSelected(region.properties.get('name'))) {
			if (this.clearSelectionIfClickedOnSelected) {
				this.deselectRegion(region.properties.get('name'));
			}
			return;
		}

		region.options.set(this.selectedStyle);

		/*var groupRegion = new ymaps.OverlayGroup();
		var shapes = region.metaDataProperty.encodedShapes;
		for (var i = 0; i < shapes.length; i++) {
			var polygon = ymaps.Polygon.fromEncodedPoints(
				shapes[i].coords,
				shapes[i].levels, {
					style: "region#selected",
					zIndex: 10000,
					hasHint: true,
					hasBalloon: false
				}
			);
			polygon.name = region.name;
			groupRegion.add(polygon);
			ymaps.Events.observe(polygon, polygon.Events.Click, function() {
				return this.deselectRegion(region.name);
			}, this);
		}
		this.map.addOverlay(groupRegion);*/

		/*if (!this.multiSelect) {
			// if not multiselect remove previous selections
			// do it by deleting by one item (not "removeAll", because
			// "remove" event not fired up in that case)
			while (this.selectedRegions.getCount() > 0) {
				this.selectedRegions.removeAt(0);
			}
		}*/

		this.selectedRegions.add(
			this.convertName(region.properties.get('name')),
			region
		);
	},

/**
	* Region selection by its name (case sensitive)
	* @param {String} regionName Region name
	*/
	selectRegionByName: function(regionName) {
		regionName = this.convertName(regionName);
		this.selectRegions(
			[regionName]);
	},

/**
	* Selects regions (case sensitive)
	* @param {String[]} list List of region names
	*/
	selectRegions: function(list) {
		if (!this.isLoaded()) {
			if (!this.waitingForSelection) {
				this.waitingForSelection = [];
			}
			this.waitingForSelection = this.waitingForSelection.concat(list);
			return;
		}
		var selectionFlag = Ext.clone(this.clearSelectionIfClickedOnSelected);
		this.clearSelectionIfClickedOnSelected = false;
		// For each region look if its name exists in the list array
		this.regionsCollection.each(function(region) {
			if (Ext.Array.indexOf(list,
					this.convertName(region.properties.get('name'))) >= 0)
			{
				this.selectRegion(region);
			}
		}, this);
		this.clearSelectionIfClickedOnSelected = Ext.clone(selectionFlag);
	},

/**
	* Removes selection from all regions
	*/
	deselectAll: function() {
		if (!this.isLoaded()) {
			this.waitingForSelection = null;
			return;
		}
		// For each region look if its name exists in the list array
		this.regionsCollection.each(function(region) {
			this.deselectRegion(region.properties.get('name'));
		}, this);
	},

/**
	* Removes selection from all objects
	*/
	deselectAllObjects: function() {
		if (!this.isLoaded()) {
			this.waitingForSelection = null;
			return;
		}
		this.panelListObjects.setChecked(false);
		this.selectedObjects.clear();
	},

/**
	* Adds an object to the map drawing marker
	* @param {Object} object
	* @param {Boolean} clearExisting If true, delete existing objects
	*/
	addObject: function(object, clearExisting) {
		this.addObjects([object], clearExisting);
	},

/**
	* Adds an objects to the map drawing marker
	* @param {Object[]} list List of an objects to display
	* @param {Boolean} clearExisting If true, delete existing objects
	*/
	addObjects: function(list, clearExisting) {
		if (clearExisting) {
			this.deselectAllObjects();
			this.listOfObjects.clear();
		}
		this.listOfObjects.addAll(list);
		if (!this.dataObjects) {
			this.dataObjects = {};//Ext.create('O.data.GroupedCollection');
		}
		this.dataObjects.objects = this.getObjects();
		//this.dataObjects.reloadCollections();
		this.panelListObjects.loadData(C.utils.virtualGroups.ALL,
			this.listOfObjects.getKeys(), this.dataObjects, []);
	},

/**
	* Select an object
	* @param {Object/Number} object List of an objects (or ids) to display
	* @param {Boolean} clearSelection If true, clears previous selection
	*/
	selectObject: function(object, clearSelection) {
		this.selectObjects([object], clearSelection);
	},

/**
	* Selects objects
	* @param {Object[]/Number[]} list List of an objects (or ids) to display
	* @param {Boolean} clearSelection If true, clears previous selection
	*/
	selectObjects: function(list, clearSelection) {
		if (!this.isLoaded()) {
			if (!this.waitingForObjectSelection) {
				this.waitingForObjectSelection = [];
			}
			this.waitingForObjectSelection =
				this.waitingForObjectSelection.concat(list);
			return;
		}
		if (clearSelection) {
			this.deselectAllObjects();
		}
		Ext.each(list, function(object) {
			var obj = object;
			if (Ext.isNumber(object)) {
				obj = this.listOfObjects.getByKey(obj);
			}
			if (obj) {
				this.panelListObjects.check(obj.id);
				this.selectedObjects.add(obj);
			}
		}, this);
	},

/**
	* Deselect object
	* @param {Object/Number} object An object or an id
	*/
	deselectObject: function(object) {
		this.deselectObjects([object]);
	},

/**
	* Deselect object
	* @param {Object/Number} object An object or an id
	*/
	deselectObjects: function(list) {
		Ext.each(list, function(object) {
			var obj = object;
			if (Ext.isNumber(object)) {
				obj = this.listOfObjects.getByKey(obj);
			}
			if (obj) {
				if (this.isObjectSelected(obj.id)) {
					this.panelListObjects.uncheck(obj.id);
					this.selectedObjects.remove(obj);
				}
			}
		}, this);
	},

/**
	* Set center of the map
	* @param {Number} lat Latitude
	* @param {Number} lon Longitude
	*/
	setCenter: function(lat, lon) {
		if (this.map) {
			this.map.panTo([lon, lat]);
		}
	}
});