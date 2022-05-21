/**
 * @class M.lib.grouplist.Panel
 */
C.utils.inherit('M.lib.grouplist.Panel', {

/**
	* @construct
	* @override
	*/
	initialize: function() {
		// init checked objects array
		this.checkedObjects = [];
		// call overridden
		this.callOverridden(arguments);
		// init properties of components
		this.storeObjects = C.getStore(this.config.itemAlias);
		this.storeObjects.sort('name', 'ASC');
		this.storeSearch = new Ext.data.Store({
			sorters: 'name',
			fields: ['id', 'name'],
			data: this.storeObjects.getRange()
		});
		var dataGroups = [];
		if (this.config.itemAlias !== 'mon_geofence') {
			// TEMPORARY FIX
			// (while there is no mon_geofence groups)
			var groupAlias = 'x_group_' + this.config.itemAlias;
			dataGroups = C.getStore(groupAlias).getRange();
		}
		var data = [{
			id: C.utils.virtualGroups.ALL,
			name: _('All'),
			count: this.storeObjects.getCount(),
			weight: -5,
			objects: []
		}, {
			id: C.utils.virtualGroups.SEARCHRESULTS,
			name: _('Search results'),
			count: 0,
			weight: -4,
			objects: []
		}];

		if (this.getMultiSelectObjects()) {
			data.push({
				id: C.utils.virtualGroups.SELECTED,
				name: _('Selected'),
				count: 0,
				weight: -3,
				objects: []
			});
		}
		for (var i = 0, l = dataGroups.length; i < l; i++) {
			var group = dataGroups[i];
			var items = group.get('items') || [];
			data.push({
				id: group.getId(),
				name: group.get('name'),
				count: items.length,
				weight: 0,
				objects: items
			});
		}
		this.listGroups.setStore(Ext.create('Ext.data.Store', {
			sorters: 'weight',
			fields: ['id', 'name', 'count', 'weight', 'objects'],
			data: data
		}));
		this.listObjects.setStore(this.storeObjects);

		var store = this.listGroups.getStore();
		var recordAll = store.getById(C.utils.virtualGroups.ALL),
			recordSearch = store.getById(C.utils.virtualGroups.SEARCHRESULTS),
			recordSelected = store.getById(C.utils.virtualGroups.SELECTED),
			viewItems = this.listGroups.getViewItems();
		this.recordGroupSelected = recordSelected;
		this.groupAllEl = viewItems[store.indexOf(recordAll)];
		this.groupSearchEl = viewItems[store.indexOf(recordSearch)];
		if (recordSelected) {
			this.groupSelected = viewItems[store.indexOf(recordSelected)];
		}
		this.groupAllEl.className += ' group-all';
		this.groupSearchEl.className += ' group-search hidden';
		if (this.groupSelected) {
			this.groupSelected.className += ' group-selected';
		}

		// add listeners
		this.listGroups.on({
			itemtap: Ext.bind(this.onListGroupsItemTap, this, []),
			scope: this
		});
		this.listObjects.on('itemtap', 'onListObjectsItemTap', this);
		this.btnBack.on('tap', 'onBtnBackTap', this);
		if (this.btnCheckMenu) {
			this.btnCheckMenu.on('itemtap', 'onBtnCheckTap', this);
		}
		this.fieldSearch.on({
			keyup: Ext.bind(this.onFieldSearchKeyUp, this, ['keyup']),
			clearicontap: Ext.bind(this.onFieldSearchKeyUp, this, ['blur']),
			scope: this
		});

		// show lists
		this.listGroups.show();
		this.listObjects.show();
	},

/**
	* Tap of the button of check menu
	* @param {M.kernel.ui.ButtonMenu} menu
	* @param {Ext.Button} button
	* @private
	*/
	onBtnCheckTap: function(menu, button) {
		switch (button.config.action) {
			case 'check':
				this.checkAll();
				break;
			case 'uncheck':
				this.uncheckAll();
				break;
		}
	},

/**
	* On groups list item tap: show object list owned selected group
	* @param bool noFire No fire event && set search group
	* @private
	*/
	onListGroupsItemTap: function(noFire) {
		var store = this.listObjects.getStore();
		store.clearFilter(true);
		this.selectedGroup = this.listGroups.getSelection()[0];
		var selectedGroupName = this.selectedGroup.get('name'),
			selectedGroupId = this.selectedGroup.getId(),
			objectIds = this.selectedGroup.get('objects'),
			objects = this.storeObjects.getRange(),
			selected = [];
		this.toolbarObjects.setTitle(selectedGroupName);
		for (var i = 0, l = objects.length; i < l; i++) {
			var objectId = objects[i].getId();
			if (selectedGroupId === C.utils.virtualGroups.ALL) {
				objectIds.push(objectId);
			}
			if (Ext.Array.indexOf(this.checkedObjects, objectId) > -1) {
				selected.push(objects[i]);
			}
		}
		store.filter(Ext.create('Ext.util.Filter', {
			filterFn: function(record) {
				return Ext.Array.indexOf(objectIds, record.getId()) > -1;
			}
		}));
		if (this.selectedItemId) {
			this.doObjectSelectionById(this.selectedItemId);
		}
		if (this.getMultiSelectObjects()) {
			this.listObjects.select(selected, false, true);
		}
		this.cards.setActiveItem(1);
		this.cards.getLayout().setAnimation({
			type: 'slide',
			direction: 'right'
		});
		if (!noFire) {
			this.fireEvent('select', this, selectedGroupId);
			this.fireEvent('selectionchange', this, selectedGroupId);
		}
	},

/**
	* Visual selection of an object by its id
	* @param {Number} objectId
	* @private
	*/
	doObjectSelectionById: function(objectId) {
		var records = this.listObjects.getStore().getRange(),
			selectedIndex = -1;
		for (var i = 0, l = records.length; i < l; i++) {
			if (records[i].getId() == objectId) {
				selectedIndex = i;
				break;
			}
		}
		if (selectedIndex > -1) {
			var item = Ext.get(this.listObjects.getViewItems()[selectedIndex]);
			this.doSelection(item, objectId);
		}
	},

/**
	* On objects list item tap: select and remember selected item
	* @private
	*/
	onListObjectsItemTap: function(cmp, index, item) {
		var store = this.listObjects.getStore(),
			record = store.getAt(index),
			itemId = record.getId(),
			isNewSelection = (itemId !== this.selectedItemId),
			isNewCheckedItem = true;

		var checkedIndex = Ext.Array.indexOf(this.checkedObjects, itemId);

		// item was checked already
		if (checkedIndex > -1) {
			isNewCheckedItem = isNewSelection ? null : false;
			if (!isNewSelection) {
				if (this.getMultiSelectObjects()) {
					this.checkedObjects.splice(checkedIndex, 1);
				}
			} else {
				this.listObjects.select(record, true, true);
			}
		} else {
			isNewCheckedItem = true;
			if (this.getMultiSelectObjects()) {
				this.checkedObjects.push(itemId);
			}
		}
		if (isNewCheckedItem === false &&
				this.selectedGroup.getId() ===
					C.utils.virtualGroups.SELECTED) {
			// TODO this is ugly:
			this.onListGroupsItemTap(true);
		}
		if (isNewSelection) {
			this.doSelection(item, itemId);
			// fire events
			this.fireEvent('select', this, itemId);
			this.fireEvent('selectionchange', this, itemId);
		}
		if (isNewCheckedItem !== null && this.getMultiSelectObjects()) {
			this.updateGroups();
			this.fireEvent(isNewCheckedItem ? 'check' : 'uncheck',
				this, itemId);
			this.fireEvent('checkchange', this, this.getCheckedObjects());
		}
	},

/**
	* Make a selection
	* @private
	*/
	doSelection: function(item, itemId) {
		this.deselectObjects();
		if (item && itemId) {
			this.selectedObject = item;
			this.selectedItemId = itemId;
		}
		if (this.selectedObject) {
			this.selectedObject.addCls('selected');
			if (!this.getMultiSelectObjects()) {
				this.selectedObject.removeCls('x-item-selected');
			}
		}
	},

/**
	* Allow (or disallow) multiple selection of devices
	* @param {Boolean} value
	*/
	applyMultiSelectObjects: function(value) {
		if (this.btnCheckAll) {
			this.btnCheckAll.setHidden(!value);
		}
		if (this.btnUncheckAll) {
			this.btnUncheckAll.setHidden(!value);
		}
		return value;
	},

/**
	* Updates groups counters
	* @private
	*/
	updateGroups: function() {
		//var selectedGroup = this.listGroups.getStore().getById(
		//	C.utils.virtualGroups.SELECTED);
		if (this.recordGroupSelected) {
			this.recordGroupSelected.set('objects', this.checkedObjects);
			this.recordGroupSelected.set('count', this.checkedObjects.length);
		}
	},

/**
	* On back button tap: return to the groups list
	* @private
	*/
	onBtnBackTap: function() {
		this.cards.setActiveItem(0);
		this.cards.getLayout().setAnimation({
			type: 'slide',
			direction: 'left'
		});
	},

/**
	* Check all items
	*/
	checkAll: function() {
		var records = this.listObjects.getStore().getRange();
		this.listObjects.select(records);
		for (var i = 0, l = records.length; i < l; i++) {
			var itemId = records[i].getId();
			if (Ext.Array.indexOf(this.checkedObjects, itemId) == -1) {
				this.checkedObjects.push(itemId);
			}
		}
		this.doSelection();
		this.updateGroups();
		this.fireEvent('checkchange', this, this.getCheckedObjects());
	},

/**
	* Uncheck all items
	*/
	uncheckAll: function() {
		var records = this.listObjects.getStore().getRange();
		this.listObjects.select([]);
		for (var i = 0, l = records.length; i < l; i++) {
			var itemId = records[i].getId(),
				selectedIndex = Ext.Array.indexOf(this.checkedObjects, itemId);
			if (selectedIndex > -1) {
				this.checkedObjects.splice(selectedIndex, 1);
			}
		}
		this.updateGroups();
		this.onListGroupsItemTap(true);
		this.fireEvent('checkchange', this, this.getCheckedObjects());
	},

/**
	* Search
	* @param {String} eventAlias
	* @private
	*/
	onFieldSearchKeyUp: function(eventAlias) {
		var groups = this.listGroups.getStore().getRange();
		var str = this.fieldSearch.getValue();
		var objects = [];
		this.storeSearch.clearFilter();
		this.groupSearchEl.className =
			this.groupSearchEl.className.replace(/ hidden/, '');
		var filter;
		if (str) {
			filter = Ext.create('Ext.util.Filter', {
				property: 'name',
				value: new RegExp(Ext.String.escapeRegex(str), 'i')
			});
		} else {
			filter = Ext.create('Ext.util.Filter', {
				filterFn: function() {
					return false;
				}
			});
		}
		this.storeSearch.filter(filter);
		var records = this.storeSearch.getRange();
		for (var i = 0, l = records.length; i < l; i++) {
			objects.push(records[i].data.id);
		}
		for (var i = 0, l = groups.length; i < l; i++) {
			if (groups[i].data.id ==
					C.utils.virtualGroups.SEARCHRESULTS) {
				groups[i].set('count', this.storeSearch.getCount());
				groups[i].set('objects', objects);
			}
		}
		var searchRecord = this.listGroups.getStore().getAt(1);
		if (str) {
			if (!this.selectedGroup || (this.selectedGroup.getId() !=
					C.utils.virtualGroups.SEARCHRESULTS)) {
				this.onBtnBackTap();
			}
			this.listGroups.select(searchRecord);
			this.onListGroupsItemTap();
		} else {
			this.listGroups.deselect(searchRecord);
			this.onBtnBackTap();
			this.groupSearchEl.className += ' hidden';
		}
	},

/**
	* Returns selected object identifier
	* @return Number
	*/
	getSelectedObjectId: function() {
		return this.selectedItemId;
	},

	/**
	 * Get selected objects
	 * @return Number[]
	 */
	getCheckedObjects: function() {
		return this.checkedObjects;
	},

/**
	* Deselects all selected objects
	*/
	deselectObjects: function() {
		if (this.selectedObject) {
			this.selectedObject.removeCls('selected');
		}
	},

/**
	* Select object by its id
	* @param {Number} id
	*/
	selectObjectId: function(id) {
		this.deselectObjects();
		this.selectedItemId = id;
		this.doObjectSelectionById(this.selectedItemId)
		this.fireEvent('select', this, id);
		this.fireEvent('selectionchange', this, id);
	},

/**
	* Check objects by ids
	* @param {Number[]} ids Array of an object identifiers
	*/
	checkObjects: function(ids) {
		for (var i = 0, l = ids.length; i < l; i++) {
			var record = this.storeObjects.getById(ids[i]);
			if (record && Ext.Array.indexOf(this.checkedObjects, ids[i]) < 0) {
				this.checkedObjects.push(ids[i]);
			}
		}
		this.doSelection();
		this.updateGroups();
		this.fireEvent('checkchange', this, this.getCheckedObjects());
	}
});
