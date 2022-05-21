/**
 * @class O.lib.grouplist.Objects
 */
C.utils.inherit('O.lib.grouplist.Objects', {

/**
	* @event check
	* Fires when object is checked
	*/
/**
	* @event uncheck
	* Fires when object is unchecked
	*/
/**
	* @event listchange
	* Fires when object list is changed
	*/

/**
	* Component initialization
	*/
	initComponent: function() {
		this.callOverridden(arguments);

		this.setCollection(new Ext.util.MixedCollection());

		if (this.grid) {
			this.grid.on({
				itemclick: 'onItemClick',
				beforeitemmousedown: 'onBeforeItemMouseDown',
				scope: this
			});

			var sm = this.grid.getSelectionModel();
			if (sm) {
				sm.on({
					select: 'onSelect',
					deselect: 'onDeselect',
					selectionchange: 'onSelectionChange',
					scope: this
				});
			}
			var checkcolumn = this.grid.down('checkcolumn');
			if (checkcolumn) {
				checkcolumn.on({
					'checkchange': {
						fn: this.onCheckChanged,
						scope: this
					},
					'beforecheckchange': {
						fn: this.onBeforeCheckChanged,
						scope: this
					}
				})
			}
		}
		if (this.getShowSelectAll()) {
			if (this.btnCheckAll) {
				this.btnCheckAll.setHandler(
					Ext.bind(this.setChecked, this, [true]));
			}
			if (this.btnCheckNone) {
				this.btnCheckNone.setHandler(
					Ext.bind(this.setChecked, this, [false]));
			}
		}
		if (this.btnShowDisabled) {
			this.btnShowDisabled.setHandler(this.toggleDisabled, this);
		}
	},

	/**
	 * Updates stored object data
	 * @param collection
	 */
	updateCollection: function(collection) {
		var selected = this.getSelected(),
			objects = [];
		this.selectionClear();

		collection.each(function(obj) {
			var disabled = (obj.state == C.cfg.RECORD_IS_DISABLED);

			objects.push(Ext.apply({
				id: obj.id,
				name: obj.name,
				disabled: disabled
			}, this.getAdditionalCollectionParams(obj)));
		}, this);

		this.getCollection().clear();
		this.getCollection().addAll(objects);

		collection.each(function(obj) {
			if (Ext.Array.indexOf(selected, obj.id) != -1) {
				this.selectionAdd(obj.id);
			}
		}, this);
	},

	/**
	 * Fetches additional data about object before adding to collection
	 * @param {object} object
	 * @returns {object}
	 */
	getAdditionalCollectionParams: function(object) {
		return {}
	},

	/**
	 * Adds given item to selection
	 * @param objectId
	 */
	selectionAdd: function(objectId) {
		// If no object don't select it
		if (!this.getCollection().getByKey(objectId)) {
			return;
		}
		Ext.Array.include(this.getSelected(), objectId);
	},

	/**
	 * Removes given item from selection
	 * @param objectId
	 */
	selectionRemove: function(objectId) {
		Ext.Array.remove(this.getSelected(), objectId);
	},

	/**
	 * Removes all items from selection
	 */
	selectionClear: function() {
		this.setSelected([]);
	},

/**
	* Returns true if record disabled
	* @param {Ext.model.Record} record
	* @return {Boolean}
	*/
	isRecordDisabled: function(record) {
		return record.get('disabled');
	},

/**
	* Set all recods enabled/disabled
	* @param {Boolean} val Enabled
	*/
	setChecked: function(val) {
		var me = this;
		var ids = [];
		this.gridStore.each(function(record) {
			if(!me.isRecordDisabled(record)) {
				ids.push(record.get('id'));
				record.set('enabled', val);
				record.commit();
			}
		});
		this.fireEvent('checkchange', ids, val);
	},

/**
	* Get checked records
	* @return Number[] Checked records identifiers
	*/
	getChecked: function() {
		var ids = [];
		this.gridStore.each(function(record) {
			if (record.get('enabled')) {
				ids.push(record.getId());
			}
		});
		return ids;
	},

/**
	* On object before check changed handler
	* @param {Object} o
	* @param {Number} index
	* @param {Boolean} checked
	*/
	onBeforeCheckChanged: function(o, index, checked) {
		var record = this.gridStore.getAt(index);
		return !this.isRecordDisabled(record);
	},

/**
	* On object check changed handler
	* @param {Object} o
	* @param {Number} index
	* @param {Boolean} checked
	*/
	onCheckChanged: function(o, index, checked) {

		var record = this.gridStore.getAt(index);
		record.commit();
		this.inCheck = (record.getId() !== this.getSelectedObject());
		this.fireEvent(checked ? 'check' : 'uncheck', record);
		return false;
	},

/**
	* Before mouse down handler
	* @param {Ext.selection.Model} sm
	* @param {Ext.model.Record} record
	*/
	onBeforeItemMouseDown: function(sm, record) {
		this.inSelect = (record.getId() !== this.getSelectedObject());
		if (this.inCheck) {
			this.inCheck = false;
			//return false;
		}
		return true;
	},

/**
	* Select handler
	* @param {Ext.selection.Model} sm
	* @param {Ext.model.Record} record
	*/
	onSelect: function(sm, record) {
		if (!this.inCheck) {
			this.fireEvent('select', sm, record);
		}
	},

/**
	* Deselect handler
	* @param {Ext.selection.Model} sm
	* @param {Ext.model.Record} record
	*/
	onDeselect: function(sm, record) {
		this.fireEvent('deselect', sm, record);
	},

/**
	* Selection change handler
	* @param {Ext.selection.Model} sm
	* @param {Ext.model.Record} record
	*/
	onSelectionChange: function(sm, record) {
		if (!this.inCheck) {
			this.fireEvent('selectionchange', sm, record);
		}
		this.inCheck = false;
	},


/**
	* Loads data into grid
	* @param {Number[]} objectsIds Grouped objects identifiers
	* @param {Number[]} selectedIds
	*/
	loadData: function(objectsIds, selectedIds) {
		var objectsList = [];
		Ext.each(objectsIds, function(objectId) {
			var object = this.getCollection().get(objectId);
			if (object) {
				objectsList.push(Ext.apply({
					id: objectId,
					name: object.name,
					enabled: Ext.Array.indexOf(selectedIds, objectId) > -1,
					disabled: object.disabled
				}, this.getAdditionalParams(object)));
			}
		}, this);

		this.gridStore.loadData(objectsList);
		this.updateSelected();
	},

	/**
	 * Fetches additional data about object
	 * @param {object} object
	 * @returns {object}
	 */
	getAdditionalParams: function(object) {
		return {}
	},

/**
	* Toggles display of disabled elements
	* @param {Ext.button.Button} button
	*/
	toggleDisabled: function(button) {
		if (button.pressed) {
			this.gridStore.clearFilter(true);
		} else {
			this.gridStore.filter(this.disabledFilter);
		}
		this.gridStore.sort(this.nameSort);
		this.fireEvent('disabledToggle', button.pressed);
	},

/**
	* Returns information, is disabled objects displayed or not
	* @return {Boolean} button
	*/
	isDisabledDisplayed: function() {
		return this.btnShowDisabled ? this.btnShowDisabled.pressed : true;
	},

/**
	* Selects objects in list, according to a selected array
	*/
	updateSelected: function() {
		var sm = this.grid.getSelectionModel();
		if (sm) {
			sm.suspendEvents();
			sm.deselectAll();
			var rec = this.gridStore.getById(this.focusedItemId);
			if (rec) {
				sm.select([rec]);
			}
			sm.resumeEvents();
		}
	},

/**
	* Select object by its Id
	* @param {Number} objectId Object identifier
	*/
	select: function(objectId) {
		var rec = this.gridStore.getById(objectId);
		if (rec) {
			var sm = this.grid.getSelectionModel();
			if (sm) {
				sm.select(rec);
			}
		}
	},

/**
	* Sets object field "enabled" to true or false
	* @param {Number} objectId Object identifier
	* @param {Boolean} value Value of "enabled" field
	*/
	setObjectEnabled: function(objectId, value) {
		var record = this.gridStore.getById(objectId);
		if (record) {
			record.set('enabled', value);
			record.commit();
		}
	},

	/**
	 * Sets currently focused item
	 * @param objectId
	 */
	setFocusedItem: function(objectId) {
		this.focusedItemId = objectId;
	},

/**
	* Checks object by its Id
	* @param {Number} objectId Object identifier
	*/
	check: function(objectId) {
		this.setObjectEnabled(objectId, true);
		// DO NOT CALL HERE this.fireEvent('check');
		// cause it whould break most of the code in project!
		// Of course we can refactor this behaviour in future, but there
		// is a need of deep understanding of code flow
	},

/**
	* Unchecks object by its Id
	* @param {Number} objectId Object identifier
	*/
	uncheck: function(objectId) {
		this.setObjectEnabled(objectId, false);
		// DO NOT CALL HERE this.fireEvent('uncheck');
		// cause it whould break most of the code in project!
		// Of course we can refactor this behaviour in future, but there
		// is a need of deep understanding of code flow
	},

/**
	* Checks object by its name
	* @param {String} objectName
	*/
	checkByName: function(objectName) {
		// lets find object identifier by name
		var recordIndex = this.gridStore.find('name', objectName);
		var rec = this.gridStore.getAt(recordIndex);
		if (rec) {
			this.check(rec.getId());
		}
	},

/**
	* Unchecks object by its name
	* @param {String} objectName
	*/
	uncheckByName: function(objectName) {
		// lets find object identifier by name
		var recordIndex = this.gridStore.find('name', objectName);
		var rec = this.gridStore.getAt(recordIndex);
		if (rec) {
			this.uncheck(rec.getId());
		}
	},

/**
	* Returns an identifier of a selected object
	* @return {Number} Identifer of an object or null if there is no selection
	*/
	getSelectedObject: function() {
		var selection = this.grid.getSelectionModel().getSelection();
		return (selection && selection[0]) ? selection[0].getId() : null;
	},

/**
	* Called after click on grid item
	* @param {Object} cmp Grid
	* @param {Object} record Selected record
	*/
	onItemClick: function(cmp, record) {
		if (!this.inSelect) {
			var sm = this.grid.getSelectionModel();
			sm.deselectAll();
			sm.select(record);
		}
		this.inSelect = false;
	}
});