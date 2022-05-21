/**
 *
 * @class O.lib.grouplist.Panel
 * @extends C.ui.Panel
 */
C.utils.inherit('O.lib.grouplist.Panel', {

	/**
	 * @event selectionchange
	 * Fires when array of selected objects is changed
	 * @param {O.lib.abstract.GroupsList} this
	 * @param {Number[]} items Array of object identifiers
	 */
	/**
	 * @event select
	 * Fires when object is selected
	 * @param {O.lib.abstract.GroupsList} this
	 * @param {Number} objectId Object identifier
	 */
	/**
	 * @event deselect
	 * Fires when object is unselected
	 * @param {O.lib.abstract.GroupsList} this
	 * @param {Number} objectId Object identifier
	 */
	/**
	 * @event afterload
	 * Fires when objects are loaded
	 * @param {O.lib.abstract.GroupsList} this
	 * @param {Object} data Loaded data
	 */
	/**
	 * @event check
	 * Fires when object is checked
	 * @param {O.lib.abstract.GroupsList} this
	 * @param {Number} objectId Object identifier
	 */
	/**
	 * @event uncheck
	 * Fires when object is unchecked
	 * @param {O.lib.abstract.GroupsList} this
	 * @param {Number} objectId Object identifier
	 */
	/**
	 * @event checkchange
	 * Fires when object is unchecked
	 * @param {O.lib.abstract.GroupsList} this
	 * @param {Number[]} items Array of object identifiers
	 */

/**
	* Component initialization
	*/
	initComponent: function() {
		this.callOverridden();

		if (!this.listGroups) {
			console.error('Error: Groups list panel not found!');
			return;
		}

		if (!this.listObjects) {
			console.error('Error: Objects list panel not found!');
			return;
		}
		this.listGroups.on({
			check: this.onGroupCheck,
			uncheck: this.onGroupUncheck,
			select: this.onGroupSelect,
			scope: this
		});
		this.listObjects.on({
			check: this.onObjectCheck,
			uncheck: this.onObjectUncheck,
			select: this.onObjectSelect,
			deselect: this.onObjectDeselect,
			beforeselect: this.onObjectBeforeSelect,
			checkchange: this.onObjectCheckChange,
			disabledToggle: this.onObjectDisabledToggle,
			scope: this
		});

		// Search
		if (this.searchField) {
			this.searchField.on({
				specialkey: this.onSearchFieldSpecialKey,
				keyup: this.doSearch,
				scope:this
			});
		}

		this.on('afterrender', 'reload', this);

		O.manager.Model.bind(
			[this.getGroupName(), this.getClassAlias(), 'x_user'],
			this.onModelChange, this);

		this.onObjectDisabledToggle(this.listObjects.isDisabledDisplayed());
	},

/**
	* Returns group name for class alias
	*/
	getGroupName: function() {
		return 'x_group_' + this.getClassAlias();
	},

/**
	* Returns row class if needed
	* @param {Ext.data.Model} record
	*/
	getRowClassObjects: function(record) {
		if (record.get('disabled') == true) {
			return 'group-list-italic';
		}

		return 'group-list-normal';
	},

/**
	* Data reload on model change
	* @param {Object} data Changed data
	*/
	onModelChange: function(data) {
		this.reload(true);
	},

/**
	* Loads groups from model
	*/
	reload: function(notFirstLoad) {
		var groups = C.get(this.getGroupName());
		var items = C.get(this.getClassAlias());

		this.listGroups.updateCollection(groups, 'items');
		this.listObjects.updateCollection(items);
		this.setGroupsData();
		if (notFirstLoad) {
			this.doDefaultSelection();
		}
		this.fireEvent('listchange', this, this.getSelectedItems());
	},

/**
	* Before object select handler
	*/
	onObjectBeforeSelect: function() {
		return !this.disabled;
	},

/**
	* Resets the selection
	*/
	resetSelection: function() {
		this.listGroups.select(C.utils.virtualGroups.ALL);
		this.checkItems([]);
	},

	setGroupsData: function() {
		this.listGroups.loadData(this.listObjects.getCollection(),
			this.listObjects.getSelected(), this.getSearch());
	},

/**
	* 'All' group selection
	*/
	doDefaultSelection: function() {
		var groupId = this.listGroups.getSelectedGroup();
		if (!groupId) {
			this.selectGroup(C.utils.virtualGroups.ALL);
		}
	},

/**
	* Search handler
	*/
	doSearch: function() {
		var searchString = this.searchField.getValue();
		var regexp = null,
			pattern = Ext.String.escapeRegex(searchString)
				.replace(/\*/g, '.*')
				.replace(/%/g, '.*');
		try
		{
			regexp = new RegExp(pattern, 'ig');
			var filter = new Ext.util.Filter({
				filterFn: function(item) {
					var name = item.name + '';
					return name.match(regexp);
				}
			});
			var result = this.listObjects.getCollection().filter(filter);
			this.updateSearchResults(pattern, result);
			if (searchString === '') {
				this.listGroups.select(C.utils.virtualGroups.ALL);
			}
		}
		catch (e)
		{
			console.error('Error: Illegal regexp: ' + pattern);
		}
	},

	/**
	 * Performs search by given regexp
	 * @param searchString
	 * @param results
	 */
	updateSearchResults: function(searchString, results) {
		this.setSearch([]);
		var searchCount = 0;
		if (searchString) {
			results.each(function(item) {
				Ext.Array.include(this.getSearch(), item.id);
				if (!item.disabled) {
					searchCount++;
				}
			}, this);
		}
		this.listGroups.updateSearchResults(searchString, this.getSearch());
	},

/**
	* If user press 'Enter' we should search
	* @param {Ext.form.Field} field
	* @param {Ext.EventObject} e
	*/
	onSearchFieldSpecialKey: function(field, e) {
		if (e.getKey() == e.ENTER) {
			this.doSearch(field.getValue());
		}
	},

/**
	* Selects group by its id
	* @param {Number} groupId
	*/
	selectGroup: function(groupId) {
		this.listGroups.select(groupId);
	},

/**
	* Group selection in group list
	* @param {Ext.selection.Model} sm Selection Model
	* @param {Ext.data.Model} record Selected item
	*/
	onGroupSelect: function(sm, record) {
		var groupId = record.getId();
		var objectsIds = this.listGroups.getGroupObjects(groupId);

		this.listObjects.loadData(objectsIds, this.getSelectedItems());
	},

/**
	* Returns @true if object can be checked
	* @param {Ext.data.Model} record GroupedObject record
	* @return {Boolean}
	*/
	canCheckGroup: function(record) {
		// if virtual group and not "ALL"
		return (record.getId() >= -1);
	},

/**
	* Group check in group list
	* @param {Ext.data.Model} record Checked item
	*/
	onGroupCheck: function(record) {
		if (this.canCheckGroup(record)) {
			this.fireEvent('check', this, record.getId());
			this.fireEvent('checkchange', this, this.getSelectedItems());
		} else {
			record.set('enabled', false);
		}
	},

/**
	* Group uncheck in group list
	* @param {Ext.data.Model} record Unhecked item
	*/
	onGroupUncheck: function(record) {
		this.fireEvent('uncheck', this, record.getId());
		this.fireEvent('checkchange', this, this.getSelectedItems());
	},

/**
	* Executes when object in objects list is selected
	* @param {Ext.selection.Model} sm Selection Model
	* @param {Ext.data.Model} record GroupedObject record
	*/
	onObjectSelect: function(sm, record) {
		this.listObjects.setFocusedItem(record.getId());
		if (!this.getMultiSelectObjects()) {
			this.listObjects.selectionClear();
			this.listObjects.selectionAdd(record.getId());
			this.listGroups.updateSelection(this.getSelectedItems());
		}
		this.fireEvent('select', this, record.getId());
		this.fireEvent('selectionchange', this, this.getSelectedItems());
	},

/**
	* Executes when object in objects list is deselected
	* @param {Ext.selection.Model} sm Selection Model
	* @param {Ext.data.Model} record GroupedObject record
	*/
	onObjectDeselect: function(sm, record) {
		this.listObjects.setFocusedItem(null);
		if (!this.getMultiSelectObjects()) {
			this.listObjects.selectionRemove(record.getId());
			this.listGroups.updateSelection(this.getSelectedItems());
		}
		this.fireEvent('deselect', this, record.getId());
		this.fireEvent('selectionchange', this, this.getSelectedItems());
	},

/**
	* Returns @true if object can be checked
	* @param {Ext.data.Model} record GroupedObject record
	* @return {Boolean}
	*/
	canCheckObject: function(record) {
		return true;
	},

/**
	* Executes when object in objects list is checked
	* @param {Ext.data.Model} record GroupedObject record
	*/
	onObjectCheck: function(record) {
		if (this.canCheckObject(record)) {
			this.listObjects.selectionAdd(record.getId());
			this.listGroups.updateSelection(this.getSelectedItems());
			this.fireEvent('check', this, record.getId());
			this.fireEvent('checkchange', this, this.getSelectedItems());
		} else {
			record.set('enabled', false);
		}
	},

/**
	* Executes when object in objects list is unchecked
	* @param {Ext.data.Model} record GroupedObject record
	*/
	onObjectUncheck: function(record) {
		this.listObjects.selectionRemove(record.getId());
		this.listGroups.updateSelection(this.getSelectedItems());
		this.fireEvent('uncheck', this, record.getId());
		this.fireEvent('checkchange', this, this.getSelectedItems());
	},

/**
	* On objects list check change
	*/
	onObjectCheckChange: function(ids, val) {
		if (!val) {
			// removing selection
			for (var i = 0, l = ids.length; i < l; i++) {
				this.listObjects.selectionRemove(ids[i]);
			}
		} else {
			// adding selection
			for (var i = 0, l = ids.length; i < l; i++) {
				this.listObjects.selectionAdd(ids[i]);
			}
		}
		this.listGroups.updateSelection(this.getSelectedItems());
		this.fireEvent('checkchange', this, this.getSelectedItems());
	},

/**
	* On toggling display of disabled elements
	* @param {Boolean} enabled
	*/
	onObjectDisabledToggle: function(enabled) {
		this.listGroups.setDisabledDisplayed(enabled);
		this.setGroupsData();
	},

/**
	* Returns an array of selected groups identifiers
	* @return {Number[]}
	*/
	getSelectedGroups: function() {
		return this.listGroups.getCheckedGroups();
	},

/**
	* Returns an array of selected objects identifiers
	* @return {Number[]}
	*/
	getSelectedObjects: function() {
		return this.listObjects.getSelected();
	},

/**
	* Returns an array of selected objects and groups identifiers
	* @return {Number[]}
	*/
	getSelectedItems: function() {
		var objects = this.getSelectedObjects();
		return objects.concat(this.getSelectedGroups());
	},

/**
	* Groups check
	* @param {Number[]} items
	*/
	checkGroups: function(items) {
		return this.listGroups.checkGroups(items);
	},

/**
	* Objects check
	* @param {Number[]} items
	*/
	checkObjects: function(items) {
		return this.checkItems(items);
	},

/**
	* Objects check
	* @param {Number[]} items
	* @param {Boolean} clear
	*/
	checkItems: function(items, clear) {
		if (typeof(clear) == 'undefined') clear = true;
		if (clear) {
			this.listObjects.selectionClear();
		}
		// все записи объектов
		try {
			Ext.each(items, function(id) {
				this.listObjects.selectionAdd(id);
			}, this);
			this.setGroupsData();
		} catch (e) {
			// ...
		}
	},

/**
	* Returns an identifier of a selected object
	* @return {Number} Identifer of an object or null if there is no selection
	*/
	getSelectedObjectId: function() {
		var selected = this.listObjects.getSelectedObject();
		if (!selected) {
			selected = this.listObjects.focusedItemId;
		}
		return selected;
	},

/**
	* Object selection by its identifier
	* @param {Number} id Object identifier
	*/
	selectObjectId: function(id) {
		if (!id) {
			return;
		}
		var sm = this.down('#groupsGrid').down('gridpanel').getSelectionModel();
		var groupData = sm.selected.items[0] ?
			sm.selected.items[0].data.items : [];
		var selectAll = true;
		Ext.each(groupData, function(el) {
			if (el == id) {
				selectAll = false;
				return false;
			}
		});
		if (selectAll) {
			this.listGroups.select(C.utils.virtualGroups.ALL);
		}
		this.listObjects.select(id);
	}
});
