/**
 *
 * @class O.lib.grouplist.Groups
 * @extends C.ui.Panel
 */
C.utils.inherit('O.lib.grouplist.Groups', {
/**
	 * Is disabled objects displayed in lists, or not
	 * @cfg {Boolean}
	 */
	disabledDisplayed: false,

/**
	* Component initialization
	*/
	initComponent: function() {
		this.callOverridden();
		this.setCollection(new Ext.util.MixedCollection());
		this.relayEvents(this.grid.getSelectionModel(), [
			'deselect',
			'select',
			'selectionchange'
		]);
		this.gridStore.sort({
			sorterFn: this.groupStoreSorterFn
		});
		this.initVirtualGroups();
	},

	/**
	 * Updates stored groups data
	 * @param collection
	 * @param itemsListName
	 */
	updateCollection: function(collection, itemsListName) {
		var data = [];
		collection.each(function(obj) {
			data.push({
				id: obj.id,
				name: obj.name,
				objects: obj[itemsListName || 'objects']
			});
		}, this);
		this.getCollection().clear();
		this.getCollection().addAll(data);
	},

/**
	* Group store sorter function.
	* A specific sorter function to execute.
	* Can be passed instead of {@link #property}. This sorter function allows
	* for any kind of custom/complex comparisons. The sorterFn receives two
	* arguments, the objects being compared. The function should return:
	*
	*   - -1 if o1 is "less than" o2
	*   - 0 if o1 is "equal" to o2
	*   - 1 if o1 is "greater than" o2
	*
	* @param {Object} o1
	* @param {Object} o2
	*/
	groupStoreSorterFn: function(o1, o2) {
		// order by weight
		var res = o2.get('weight') - o1.get('weight');
		if (!res) {
			// order by name
			var n1 = o1.get('name');
			var n2 = o2.get('name');
			res = n1 < n2 ? -1 : (n1 == n2 ? 0 : 1);
		}
		return res > 0 ? 1 : (res < 0 ? -1 : 0);
	},

/**
	* Virtual groups initialization
	* @private
	*/
	initVirtualGroups: function() {
		this.virtualGroups = this.getVirtualGroups();
		this.updateVirtualGroups();
	},

/**
	* Builds virtual groups array
	* @return {Ext.util.MixedCollection}
	*/
	getVirtualGroups: function() {
		var virtualGroups = new Ext.util.MixedCollection();
		virtualGroups.addAll([{
			id: C.utils.virtualGroups.SEARCHRESULTS,
			name: _('Search results'),
			type: 'searchresults',
			hideWhenEmpty: true,
			weight: 80
		}, {
			id: C.utils.virtualGroups.SELECTED,
			name: _('Selected'),
			type: 'selected',
			weight: 90
		}, {
			id: C.utils.virtualGroups.ALL,
			name: _('All'),
			type: 'all',
			weight: 100
		}]);
		return virtualGroups;
	},

/**
	* Insertion of virtual groups into the store
	*/
	updateVirtualGroups: function() {
		for (var i = 0; i < this.virtualGroups.length; i++) {
			var group = this.virtualGroups.getAt(i);
			this.gridStore.add(group);
		}
	},

/**
	* Insertion of data in virtual groups
	* @param {Number[]} objects all items array
    * @param {Number[]} selected ids of selected items
    * @param {Number[]} search ids of items found by search
	*/
	updateVirtualGroupsData: function(objects, selected, search) {
		this.updateVirtualGroup(C.utils.virtualGroups.ALL,
			objects);
		this.updateVirtualGroup(C.utils.virtualGroups.SELECTED,
			selected || []);
		this.updateVirtualGroup(C.utils.virtualGroups.SEARCHRESULTS,
			search || []);

		this.sync();
	},

/**
	* Filter objects
	*/
	filterObjects: function(ids, all, callback, scope) {
		var allObjects = [];
		var enabledObjects = [];
		var disabledObjects = [];

		var filterFn = function(objects) {
			for (var i = 0; i < ids.length; i++) {
				var id = ids[i];
				var object = objects.getByKey(id);
				if (object) {

					allObjects.push(object.id);

					if (object.state == 1 || object.disabled == false) {
						enabledObjects.push(object.id);
					}

					if (object.state == 2 || object.disabled == true) {
						disabledObjects.push(object.id);
					}
				}
			}

			var result = [];
			if (this.disabledDisplayed) {
				result = Ext.Array.merge(enabledObjects, disabledObjects);
			} else {
				result = enabledObjects;
			}

			if (callback) {
				callback.apply(scope, [result, result.length]);
			}
		};
		if (!all) {
			var objects = C.get(this.getClassAlias());
			if (objects) {
				filterFn.apply(this, [objects]);
			}
		} else {
			filterFn.apply(this, [all]);
		}
	},

/**
	* Updates virtual group items count
	* @param {Number} groupId
	* @param {Array} data Items array
	*/
	updateVirtualGroup: function(groupId, data) {
		var s = this.gridStore.getById(groupId);
		if (s) {
			this.filterObjects(data, false, function(ids, length) {
				s.set('items', ids);
				s.set('itemsCount', length);
			}, this);
		}
	},

/**
	* Synchronize the store with its items
	*/
	sync: function() {
		this.gridStore.clearFilter(true);
		this.gridStore.filter({
			filterFn: function(record) {
				if (record.get('hideWhenEmpty')) {
					if (record.get('itemsCount') == 0) {
						return false;
					}
				}
				return true;
			}
		});
		// let's sort store after filtering
		this.gridStore.sort();
	},

/**
	* Select group by its Id
	* @param {Number} groupId Group identifier
	*/
	select: function(groupId) {
		var rec = this.gridStore.getById(groupId);
		if (rec) {
			var sm = this.grid.getSelectionModel();
			if (sm) {
				sm.select(rec);
			}
		}
	},

/**
	* Returns selected group identifier
	* @return {Number} Group id
	*/
	getSelectedGroup: function() {
		var sm = this.grid.getSelectionModel();
		if (sm) {
			if (sm.hasSelection()) {
				var g = sm.getSelection()[0];
				return g.getId();
			}
		}
		return null;
	},

/**
	* Returns checked groups identifiers
	* @return {Number[]} Group id
	*/
	getCheckedGroups: function() {
		var ret = [];
		this.gridStore.each(function(record) {
			if (record.get('enabled')) {
				ret.push(record.getId());
			}
		}, this);
		return ret;
	},

/**
	* Groups check
	* @param {Number[]} groups
	*/
	checkGroups: function(groups) {
		this.clearCheck();
		Ext.each(groups, function(id) {
			var record = this.gridStore.getById(id);
			if (record) {
				record.set('enabled', true);
			}
		}, this);
	},

/**
	* Converting of data in group
	* @return {Array} Array of objects appliable to a store
	*/
	prepareData: function(objects) {
		var result = [];

		this.getCollection().each(function(group) {
			this.filterObjects(group.objects, objects, function(ids) {
				result.push({
					id: group.id,
					name: group.name,
					items: ids,
					itemsCount: ids.length,
					type: 'real_' + result.length
				});
			}, this);
		}, this);
		return result;
	},

/**
	* Stores selection before data update
	*/
	storeSelection: function() {
		var sm = this.grid.getSelectionModel();
		if (sm) {
			var selections = sm.getSelection();
			this.selectedGroups = [];
			Ext.each(selections, function(selection) {
				this.selectedGroups.push(selection.getId());
			}, this);
		}

		if (this.getMultiSelect()) {
			this.checkedGroups = this.getCheckedGroups();
		}
	},

/**
	* Restores selection before data update
	*/
	restoreSelection: function() {
		var sm = this.grid.getSelectionModel();
		if (sm) {
			if (this.selectedGroups && Ext.isArray(this.selectedGroups)) {
				var selections = [];
				for (var i = 0; i < this.selectedGroups.length; i++) {
					var groupId = this.selectedGroups[i];
					var selection = this.gridStore.getById(groupId)
					if (selection) {
						selections.push(selection);
					}
				}

				if (selections.length) {
					sm.select(selections);
				}
			}
		}

		if (this.getMultiSelect()) {
			for (var j = 0; j < this.checkedGroups.length; j++) {
				var gid = this.checkedGroups[j];
				this.gridStore.getById(gid).set('enabled', true);
			}
		}
	},

	/**
	 * Updates information about objects stored in groups
	 * @param collection
	 */
	updateObjectsInGroups: function(collection) {
		for (var i = 0; i < collection.length; i++) {
			var item = collection.getAt(i);
			var group = this.getCollection().getByKey(item.id)

			if (group) {
				group.objects = item.items;
			}
		}
	},

/**
	* Reloads selection
	*/
	reload: function() {
		this.storeSelection();
		var sm = this.grid.getSelectionModel();
		sm.deselectAll();
		this.restoreSelection();
	},

/**
	* Groups loading
	* @param {Ext.util.MixedCollection} objects Collection of objects
	* @param {Number[]} selected ids of selected items
	* @param {Number[]} search ids of items found by search
	*/
	loadData: function(objects, selected, search) {
		this.storeSelection();
		this.grid.view.all.clear();
		this.gridStore.loadData(this.prepareData(objects));
		this.updateVirtualGroups();

		var ids = [];
		objects.each(function(o){
			ids.push(o.id);
		});
		this.updateVirtualGroupsData(ids, selected, search);
		this.restoreSelection();
	},

/**
	* Returns an array of object identifiers by the groupId
	* @param {Number} groupId Group identifier
	*/
	getGroupObjects: function(groupId) {
		var rec = this.gridStore.getById(groupId);
		if (rec) {
			return rec.get('items');
		}
		return [];
	},

/**
	* Updating selected items
	* @param {Array} selected
	*/
	updateSelection: function(selected) {
		var sm = this.grid.getSelectionModel();
		if (sm) {
			this.updateVirtualGroup(C.utils.virtualGroups.SELECTED,
				selected);
			this.sync();
			var rec = sm.getLastSelected();
			if (rec) {
				if (rec.getId() === C.utils.virtualGroups.SELECTED) {
					this.fireEvent('select', sm, rec);
				}
			}
		}
	},

/**
	* Updates search results
    * @param string
    * @param results
	*/
	updateSearchResults: function(string, results) {
		var sm = this.grid.getSelectionModel();
		if (sm) {
			var rec = this.gridStore.getById(C.utils.virtualGroups.SEARCHRESULTS);
			if (rec) {
				rec.set('hideWhenEmpty', (string === ''));
			}
			this.updateVirtualGroup(C.utils.virtualGroups.SEARCHRESULTS,
				results);
			this.sync();
			rec = sm.getLastSelected();
			this.select(C.utils.virtualGroups.SEARCHRESULTS);
			if (rec) {
				if (rec.getId() === C.utils.virtualGroups.SEARCHRESULTS) {
					this.fireEvent('select', sm, rec);
				}
			}
		}
	},

/**
	 * Setter for disabledDisplayed property
	 * @param {Boolean} displayed
	 */
	setDisabledDisplayed: function(displayed) {
		this.disabledDisplayed = displayed;
	},

/**
	* Clears groups check
	*/
	clearCheck: function() {
		this.gridStore.each(function(record) {
			record.set('enabled', false);
		}, this);
	}
});
