/**
 * @class O.common.lib.modelslist.List
 */
C.utils.inherit('O.common.lib.modelslist.List', {
/*
	lngMaxCountText: 'You have reached the maximum number ' +
		'of objects on your tariff plan',
*/
/**
	* @event loaded
	* Fires after data is loaded in list
	*/
/**
	* @event select
	* Fires when item was selected from list
	*/
/**
	* @event create
	* Fires when item was created from list
	*/
/**
	* @event update
	* Fires when item was updated from list
	*/
/**
	* @event remove
	* Fires when item was deleted from list
	*/
/**
	* @event restore
	* Fires when item was restored
	*/

/**
	* @constructs
	*/
	initComponent: function() {
		this.callOverridden(arguments);
		this.filterValues = {};
		this.btnAdd.setHandler(this.addRecord, this);
		this.btnEdit.setHandler(this.editRecord, this);
		this.btnCopy.setHandler(this.copyRecord, this);
		this.btnOnOff.setHandler(this.onOffRecord, this);
		this.btnRemove.setHandler(this.removeRecord, this);
		this.btnRestore.setHandler(this.restoreFromTrash, this);

		// initial hide of rare used buttons
		if (!this.simpleStore) {
			this.btnOnOff.setVisible(this.showOnOffButton);
		} else {
			this.btnOnOff.setVisible(false);
		}
		this.btnEdit.setVisible(this.showEditButton);
		this.btnCopy.setVisible(this.showCopyButton);

		if (this.grid) {
			this.grid.on({
				afterrender: 'onAfterRender',
				select: 'onGridSelect',
				beforeselect: 'onGridBeforeSelect',
				scope: this
			});
		}

		if (this.gridStore) {
			this.gridStore.on({
				beforeload: 'onGridStoreBeforeLoad',
				load: 'onGridStoreLoad',
				scope: this
			});
		}

		if (this.fieldSearch) {
			this.fieldSearch.on({
				specialkey: 'onSearchFieldSpecialKey',
				keyup: 'search',
				scope:this
			});
		}

		if (this.btnShowDeleted) {
			this.btnShowDeleted.setHandler(this.toggleDeleted, this);
		}

		// Create store for recycle bin
		if (this.enableShowDeleted && this.gridStore.model) {
			this.trashedStore = Ext.create('Ext.data.Store', {
				model: this.gridStore.model.modelName,
				storeId: this.gridStore.model.modelName + '_trashed',
				sorters: [{
					property: this.grid.columns[0].dataIndex,
					direction: 'ASC'
				}]
			});
		}

		// Save original store
		this.normalStore = this.grid.getStore();

		// Bind function on model changes
		O.manager.Model.getCurator(this.managerAlias).addListener(
			'update', this.modelChanged, this);
	},

/**
	* Set lock on grid
	*/
	setLock: function(lock) {
		this.listLock = lock;
	},

/**
	* On gird before select handler
	*/
	onGridBeforeSelect: function() {
		return !this.listLock;
	},

/**
	* Set firm id
	* Adds list filter by id_firm
	*/
	setFirmId: function(firmId) {
		this.firmId = firmId;

		// Add filter
		this.addFilter('id_firm', firmId);
	},

/**
	* After render handler.
	* Checks if store is already filled in and fires @loaded event
	*/
	onAfterRender: function() {
		// get grid editor plugin
		this.gridEditor = this.grid.getPlugin('editor');
		if (this.gridEditor) {
			this.gridEditor.on({
				beforeedit: 'beforeEdit',
				edit: 'afterEdit',
				canceledit: 'afterEditCancel',
				scope: this
			});
		}
		// sync user interface
		this.syncUi();
		// loading of data
		if (!this.autoLoadStore) { return; }
		C.get(this.managerAlias, function(data, success) {
			if (success) {
				this.fireEvent('loaded');
			}
		}, this);
	},

/**
	* Grid selection handler
	*/
	onGridSelect: function() {
		this.syncUi();
		var record = this.getSelectedRecord();
		if (record) {
			this.lastSelectedId = record.get('id');
		}
	},

/**
	* Synchronizes user interface with current state of list.
	* Disables or enables buttons.
	* @private
	*/
	syncUi: function() {
		var record = this.getSelectedRecord();
		var isRecordSelected = (record != undefined);
		var isEditableRecord = !this.isReadonly()
			&& (isRecordSelected
				&& (!record.hasField('id')
					|| record.getId() > 0));

		this.btnCopy.setDisabled(!isEditableRecord);
		this.btnEdit.setDisabled(!isEditableRecord);
		this.btnOnOff.setDisabled(!isEditableRecord);
		this.btnRemove.setDisabled(!isEditableRecord);
		this.btnRestore.setDisabled(!isEditableRecord);

		// check add button
		var canAdd = (this.userCanAddEntities() && !this.isEditing());
		this.btnAdd.setDisabled(!canAdd);

		// according to enabled status of record
		var enabled = (isRecordSelected
			&& (!record.hasField('state')
				|| record.get('state') == C.cfg.RECORD_IS_ENABLED));

		// we change the text of the on/off button
		this.btnOnOff.setText(_(enabled ? 'Disable' : 'Enable'));
		this.btnOnOff.setIconCls(enabled ? this.offCls : this.onCls);

		this.syncUiWhenEmpty();
	},

/**
	* Synchronizes grid view where grid store is empty
	* @private
	*/
	syncUiWhenEmpty: function() {
		var view = this.grid.getView();
		if (this.gridStore.getCount() > 0) {
			view.emptyText =
				'<span class="emptyGrid">' +
					_('No data') + '. ' +
				'</span>';
			return;
		}
		var searchString = this.fieldSearch.getValue();
		var uid = Ext.id();
		var fn = null;
		if (searchString) {
			fn = function() {
				this.fieldSearch.setValue('');
				this.search();
			};
			// We need to implement setEmptyText here
			view.emptyText =
				'<span class="emptyGrid">' +
					Ext.String.format(_('No records found for ' +
						'filter "<b>{0}</b>"'), searchString) +
					'.<br/><br/>' +
					'<p style="text-align:center">' +
						'<span class="ap_button primary"' +
							' id="' + uid + '">' +
							_('Clear filter') +
						'</span>' +
					'</p>' +
				'</span>';
		} else {
			fn = this.addRecord;
			var display	=
				this.showCreateNewRecordButton ? '' : '; display: none';
			var createNewButton =
				'<p style="text-align:center' + display + '">' +
					'<span class="ap_button primary"' +
						' id="' + uid + '">' +
						_('Create new record') +
					'</span>' +
				'</p>';
			view.emptyText =
				'<span class="emptyGrid">' +
					_('No data') + '. ' + (!this.btnShowDeleted.pressed &&
						this.userCanAddEntities() ?
						'<br/><br/>' + createNewButton : '') +
				'</span>';
		}
		// TODO here can be a memory leak
		// because every call of view refresh we whould create new handler
		view.on('refresh', function() {
			var link = Ext.fly(uid);
			if (link) {
				link.on('click', Ext.bind(this.onLinkClick, this, [link, fn]));
			}
		}, this);
		//console.log('view refresh');
		view.refresh();
	},

/**
	* Handles link click
	* @param {HtmlElement} el
	* @param {Function} fn
	* @private
	*/
	onLinkClick: function(el, fn) {
		if (fn) {
			fn.call(this);
		}
	},

/**
	* Returns max count of available entities for current account
	* @return {Number}
	*/
	getMaxCountOfEntities: function() {
		// max count of objects
		if (this._maxCountOfEntities == undefined) {
			this._maxCountOfEntities = parseInt(
				C.getSetting('t.maxcountof' + this.managerAlias)
			) || C.cfg.defaultMaxCountOfEntities;
		}
		return this._maxCountOfEntities;
	},

/**
	* Returns true if user can add entities
	* @return {Boolean}
	*/
	userCanAddEntities: function() {
		if (!this.managerAlias) { return true; }
		var maxCount = this.getMaxCountOfEntities();
		return ((maxCount === C.cfg.defaultMaxCountOfEntities)
			|| (this.gridStore.getCount() < maxCount));
	},

/**
	* Returns a new record.
	* Can be overwritten by childs
	* @protected
	*/
	getNewRecordConfig: function() {
		return {};
	},

/**
	* Returns a copy of selected record.
	* Can be overwritten by childs
	* @protected
	*/
	getCopyRecordConfig: function() {
		var record = this.getSelectedRecord();
		if (!record) { return {}; }

		var data = record.getData();
		data.id = null;
		data.name = data[this.grid.columns[0].dataIndex] + ' (copy)';

		return data;
	},

/**
	* Creates a record of the specified model
	*/
	addRecord: function() {
		this.createRecord();
	},

/**
	* Record copy
	*/
	copyRecord: function() {
		this.createRecord(true);
	},

/**
	* Creates a record of the specified model
	* @param {Boolean} copy if creating a copy
	*/
	createRecord: function(copy) {
		if (this.userCanAddEntities()) {
			if (!this.model) {
				return O.msg.warning(
					_('No model specified for the modelslist'));
			}
			if (copy) {
				this.newRecordInitConfig = this.getCopyRecordConfig();
			} else {
				this.newRecordInitConfig = this.getNewRecordConfig();
			}
			this.newRecord = Ext.create(this.model, this.newRecordInitConfig);

			Ext.Object.each(this.filterValues, function(key, value){
				this.newRecord.set(key, value);
			}, this);
			if (this.newRecordIsFirst && !copy) {
				this.gridStore.insert(0, this.newRecord);
			} else {
				this.gridStore.add(this.newRecord);
			}
			this.gridEditor.startEdit(this.newRecord, 0);
		} else {
			return O.msg.error(_('You have reached the maximum count of ' +
				'this objects on your tariff plan'));
		}
		this.syncUi();
	},

/**
	* Checks if record is readonly
	* @param {Ext.data.Model} record
	* @return {Boolean}
	*/
	isReadonly: function(record) {
		if (!record) {
			record = this.getSelectedRecord();
		}
		if (!record || !record.hasField('id') || !record.getId()) {
			return false;
		}
		return (record.get('iseditable') === false);
	},

/**
	* Checks if record is shared
	* @param {Ext.data.Model} record
	* @return {Boolean}
	*/
	isShared: function(record) {
		if (!record) {
			record = this.getSelectedRecord();
		}
		return (record && record.get('isshared'));
	},

/**
	* Edit record handler
	*/
	editRecord: function() {
		var selected = this.getSelectedRecord();
		if (selected) {
			this.gridEditor.startEdit(selected, 0);
		}
		this.syncUi();
	},

/**
	* Start edit event
	*/
	beforeEdit: function() {
		if (this.disallowEditing) {
			return false;
		}
		if (this.listLock) {
			return false;
		}
		if (this.editedRecord && this.newRecord) {
			return false;
		} else {
			this.editedRecord = this.newRecord || this.getSelectedRecord();
		}
		if (!this.newRecord && this.isReadonly(this.editedRecord)) {
			return false;
		}
		try {
			window.focusedEditor = this.gridEditor.getEditor();
		} catch (e) { /* silent exception */ }
		this.syncUi();
	},

/**
	* After edit handler
	*/
	afterEdit: function(e) {
		window.focusedEditor = null;
		var record = this.getEditedRecord() || this.getSelectedRecord();
		this.save(record);
		this.editedRecord = null;
		this.newRecord = null;
		this.syncUi();
	},

/**
	* After edit cancel handler
	* @private
	*/
	afterEditCancel: function() {
		window.focusedEditor = null;
		this.editedRecord = null;
		if (this.newRecord) {
			this.gridStore.remove(this.newRecord);
			this.selectFirst();
		}
		this.newRecord = null;
		this.syncUi();
	},

/**
	* Returns currently edited record instance
	* @return {Ext.data.Model}
	*/
	getEditedRecord: function() {
		return this.editedRecord;
	},

/**
	* Search for field value by fieldName in current tab
	* @param {String} fieldName
	* @return {Object}
	*/
	getFieldValue: function(fieldName) {
		var cmp = this.down('component[dataIndex=' + fieldName + ']');
		if (cmp) {
			var field = cmp.field;
			if (field && field.getRawValue) {
				return field.getRawValue();
			}
		}
		return undefined;
	},

/**
	* Loads foreign proxies if foreign data was created
	* @param {Ext.data.Model} record
	* @param {Object} data
	* @param {Function} callback
	* @param {Object} scope
	*/
	loadForeignProxies: function(record, data, callback, scope) {
		var updatedProxies = [];
		for (var i = 0; i < record.fields.length; i++) {
			var field = record.fields.getAt(i);
			var fieldNameNew = field.name + C.cfg.newFieldPostfix;
			if (data[fieldNameNew] !== undefined &&
				field.reference !== undefined) {
				updatedProxies.push(field.reference);

				// check proxy as "dirty"
				var proxy = O.manager.Model.getProxy(field.reference);
				if (proxy && proxy.setDirty) {
					proxy.setDirty();
				}
			}
		}
		if (updatedProxies.length > 0) {
			C.get(updatedProxies, callback, scope);
		} else {
			callback.apply(scope || this);
		}
	},

/**
	* Saves changes in list of entities
	*/
	save: function(record) {
		if (!record) { return; }
		if (!this.managerAlias) {
			this.saveWithoutManager(record);
			return;
		}
		// entity is changed
		var data = record.getSubmitData();
		if (C.utils.isEmptyObject(data)) { return; }
		this.lock();

		var isNewRecord = !record.getId();
		// create closure callback function
		var callback = function(success, packet) {
			if (isNewRecord) {
				this.gridStore.remove(record);
				this.onAfterNewRecordSaved();
			} else if (packet && packet.data) {
				// apply data if supplied
				record.set(packet.data);
				(success) ?
					record.commit() :
					record.reject();
			}
			// loads foreign proxies if foreign record was created
			this.loadForeignProxies(record, data, function() {
				this.syncUi();
				this.unlock();
				if (success && this.displaySuccessMessages) {
					O.msg.saved(isNewRecord ?
						_('Created successfully') :
						_('Updated successfully'));
					this.fireEvent(isNewRecord ? 'create' : 'update',
						this, record, data, packet);
				}
				if (packet && packet.data) {
					var id = packet.data.id;
					this.selectById(id);
					//if (isNewRecord) {
						var recordIndex
							= this.gridStore.find(
								'id', id, 0, false, false, true);
						var record = this.gridStore.getAt(recordIndex);
						if (record) {
							record.set(packet.data);
							record.commit();
						}
					//}
				}
			}, this);

			// If filter exists and record is new,
			// reload filtered data after save
			if (isNewRecord) {
				if (!C.utils.isEmptyObject(this.filterValues)) {
					this.loadFiltered();
				}
			}
		}
		if (!isNewRecord) {
			// because the id is not supplied via getChanges
			// we must add it manually
			data.id = record.getId();
		} else {
			if (this.newRecordInitConfig) {
				// append initial config, if supplied
				Ext.applyIf(data, this.newRecordInitConfig);
			}
		}

		// If firm id specified
		if (this.firmId) {
			data['id_firm'] = this.firmId;
		}

		O.manager.Model[isNewRecord ? 'add' : 'set'](
			this.managerAlias, data, callback, this);
	},

/**
	 * After new record saved
	 */
	onAfterNewRecordSaved: function() {
	},

/**
	* Save record when there is no manager alias specified
	* @param {Ext.data.Record} record
	* @protected
	*/
	saveWithoutManager: function(record) {
		record.commit();
		var isNewRecord = (this.newRecord === record);
		this.fireEvent(isNewRecord ? 'create' : 'update', this, record);
	},

/**
	* Turns record off or on
	*/
	onOffRecord: function() {
		var record = this.getSelectedRecord();
		if (!record) { return; }

		record.set('state', (record.get('state') == C.cfg.RECORD_IS_ENABLED) ?
			C.cfg.RECORD_IS_DISABLED :
			C.cfg.RECORD_IS_ENABLED);

		// If firmId specified
		if (this.firmId) {
			record.set('id_firm', this.firm_id);
		}
		// save changes
		this.save(record);
	},

/**
	* Restore record from trash
	*/
	restoreFromTrash: function() {
		var record = this.getSelectedRecord();
		if (!record) { return; }
		this.setLoading(true);

		// Query params
		var params = {
			id: record.get('id'),
			state: C.cfg.RECORD_IS_ENABLED
		}

		// If firm id specified
		if (this.firmId) {
			params['id_firm'] = this.firmId;
		}

		O.manager.Model.set(this.managerAlias, params, function(success) {
			if (success) {
				this.gridStore.remove(record);
				this.selectFirst();
			}
			this.syncUi();
			this.setLoading(false);
		}, this);
	},

/**
	* Remove record
	*/
	removeRecord: function() {
		// get data
		var record = this.getSelectedRecord();
		if (!record) { return; }
		if (!this.managerAlias) {
			this.removeWithoutManager(record);
			return;
		}
		var restoreLinkId = Ext.id();
		var id = record.getId();
		var data = {id: id};

		// If firm id specified
		if (this.firmId) {
			data['id_firm'] = this.firmId;
		}

		// delete
		this.lock();
		O.manager.Model.remove(this.managerAlias, data,
			function(success) {
				if (success) {
					O.msg.info({
						msg: _('Removed successfully') + '. ' +
							'<a href="#" id=' + restoreLinkId + '>' +
								_('Cancel') + '</a>',
						// User can miss the link while clicking "Cancel", and
						// the info message would be closed.
						// I think it can dissapoint user.
						// So should we enable restoring record via click
						// on entire message box?
						//callback: Ext.bind(this.restoreRecord, this, [data])
						callback: Ext.emptyFn
					});
					var restoreLinkEl = Ext.fly(restoreLinkId);
					if (restoreLinkEl) {
						restoreLinkEl.on('click',
							Ext.bind(this.restoreRecord, this, [data]));
					}
					this.fireEvent('remove', this, data);
				}
				this.gridStore.remove(record);
				this.syncUi();
				this.unlock();
				this.selectFirst();
		}, this);
	},

/**
	* Removes record when there is no manager alias specified
	* @param {Ext.data.Record} record
	* @protected
	*/
	removeWithoutManager: function(record) {
		this.gridStore.remove(record);
		this.fireEvent('remove', this, record);
		this.syncUi();
		this.selectFirst();
	},

/**
	* Restore record after delete
	* @param {Object} data Data of the record to be restored
	*/
	restoreRecord: function(data) {
		var me = this;
		if (!this.managerAlias) { return; } // TODO customRestore call
		var params = {
			id: data.id,
			state: C.cfg.RECORD_IS_ENABLED
		}

		var callback = function(success) {
			this.fireEvent('restore', this, data);
			if (success) {
				this.selectById(data.id);
				this.syncUi();
			}
		}
		// If firm id specified
		if (this.firmId) {
			params['id_firm'] = this.firmId;
			callback = function(success) {
				if (success) {
					me.loadFiltered(function(){
						this.selectById(data.id);
						this.syncUi();
					}, this);
				}
			}
		}

		O.manager.Model.set(this.managerAlias, params, callback, this);
	},

/**
	* Selects the first record in list
	*/
	selectFirst: function() {
		if (this.gridStore.getCount() > 0) {
			var sm = this.grid.getSelectionModel();
			if (sm) {
				sm.select(0);
			}
		}
	},

/**
	* Selects record by its id
	* @param {Number} id Record model identifier
	*/
	selectById: function(id) {
		var index = this.gridStore.findExact('id', id);
		if (index) {
			var record = this.gridStore.getAt(index);
			var sm = this.grid.getSelectionModel();
			if (sm) {
				sm.select(record);
			}
		}
	},

/**
	* Returns selected record in a grid
	* @return {Ext.data.Model}
	*/
	getSelectedRecord: function() {
		var sm = this.grid.getSelectionModel();
		if (sm) {
			var selection = sm.getSelection();
			if (selection.length > 0) {
				return selection[0];
			}
		}
		return null;
	},

/**
	* Save currently selected record identifier
	* @private
	*/
	onGridStoreBeforeLoad: function() {
		this.setLoading(true);
		var record = this.getSelectedRecord();
		if (record) {
			this.lastSelectedId = record.getId();
		}
	},

/**
	* Restores previously selected record
	* @private
	*/
	onGridStoreLoad: function() {
		this.setLoading(false);
		this.selectById(this.lastSelectedId);
		this.syncUi();
	},

/**
	* Search field handler
	*/
	search: function() {
		var me = this;
		var searchString = this.fieldSearch.getValue();
		var regexp = null,
			pattern;
			pattern = Ext.String.escapeRegex(searchString)
				.replace(/\*/g, '.*')
				.replace(/%/g, '.*');
			var modifiers = 'g';
			modifiers = this.caseInsensitive ? 'i' + modifiers : modifiers;
		try
		{
			regexp = new RegExp(pattern, modifiers);
			var filter = new Ext.util.Filter({
				filterFn: function(item) {
					var string = me.getSearchString(item);
					return string.match(regexp);
				}
			});
			this.gridStore.clearFilter();
			this.gridStore.filter(filter);
			this.selectById(this.lastSelectedId);
			this.syncUi();
		}
		catch (e)
		{
			console.error('Error: Illegal regexp: ' + pattern);
			return;
		}
	},

/**
	 * Get search string
	 * @param item
	 */
	getSearchString: function(item) {
		var filterField = this.filterField ? this.filterField :
			this.grid.columns[0].dataIndex;

		var string = item.get(filterField) + '';

		return string;
	},

/**
	* If user press 'Enter' we should search
	* @param {Ext.form.Field} field
	* @param {Ext.EventObject} e
	*/
	onSearchFieldSpecialKey: function(field, e) {
		if (e.getKey() == e.ENTER) {
			this.search(field.getValue());
		}
	},

/**
	* Toggles display of deleted elements
	* @param {Ext.button.Button} button
	*/
	toggleDeleted: function(button) {
		var me = this;
		this.setLoading(true);

		// Change tooltip
		this.btnShowDeleted.setTooltip(button.pressed ?
			_('Hide deleted') :
			_('Show deleted'));
		// If recycle bin was open
		if (button.pressed) {

			// Params for load trashed records
			var params = {
				'$showtrashed': true,
				'$filter': 'state eq ' + C.cfg.RECORD_IS_TRASHED
			};

			// if id firm specified
			if (this.firmId) {
				params['$firm'] = this.firmId;
			}
			// Load deleted records
			C.get(this.managerAlias, function(response) {
				// Load new data to store
				me.trashedStore.loadData(response.items);
				// Reconfigure grid
				this.grid.reconfigure(me.trashedStore);
				// Replace grid link
				this.gridStore = this.grid.getStore();
				// Apply search filter
				this.search();
				this.selectFirst(); // Select first entry
				// change toolbars
				this.actionToolbar.hide();
				this.restoreToolbar.show();
				this.syncUi();
				this.setLoading(false);
			}, this, params);

		} else {
			// Restore grid store link
			this.gridStore = this.normalStore;
			// Apply filters
			if (!C.utils.isEmptyObject(this.filterValues)) {

				this.gridStore = Ext.create('Ext.data.Store', {
					model: O.manager.Model.getProxy(this.managerAlias).model
				});

				this.reconfigure(this.gridStore);
				if (this.gridEditor) {
					this.gridEditor.init(this);
				}

				this.loadFiltered(function() {
					// Apply search filter
					this.search();
					this.selectFirst(); // Select first entry
				}, this);
			} else {
				this.grid.reconfigure(me.gridStore);
				// Apply search filter
				this.search();
				this.selectFirst(); // Select first entry
			}
			// change toolbars
			this.restoreToolbar.hide();
			this.actionToolbar.show();
			this.syncUi();
			this.setLoading(false);
		}
	},

/**
	* Model changed handler
	*/
	modelChanged: function() {
		var me = this;
		var record = this.getSelectedRecord();
		if (record) {
			var selected = record.get('id');
		}
		// If recycle bin is opened, update store
		if (this.btnShowDeleted.pressed) {
			//if (this.filterValues !== undefined) {
			C.get(this.managerAlias, function(response) {
				var proxy = O.manager.Model.getProxy(this.managerAlias);
				if (proxy) {
					proxy.updateStore(me.trashedStore, response.items);
				}
				this.selectById(selected);
				me.syncUi();
			}, this, {
				'$showtrashed': true,
				'$filter': 'state eq ' + C.cfg.RECORD_IS_TRASHED
			});
		}
	},

/**
	* Adds filter to list
	* @param {String} field
	* @param {Mixed} value
	*/
	addFilter: function(field, value) {
		if (field && value) {
			this.filterValues[field] = value;
		}

		this.gridStore = Ext.create('Ext.data.Store', {
			model: O.manager.Model.getProxy(this.managerAlias).model
		});
		this.reconfigure(this.gridStore);
		if (this.gridEditor) {
			this.gridEditor.init(this);
		}

		this.loadFiltered();
	},

/**
	* Loads filtered data
	*/
	loadFiltered: function(callback, scope) {
		this.lock();

		var params = {};
		var filter = [];
		Ext.Object.each(this.filterValues, function(field, value) {
			if (field == 'id_firm') {
				params['$firm'] = value;
			} else {
				filter.push(field + ' eq ' + value);
			}
		});

		if (filter.length > 0) {
			params['$filter'] = filter.join(' and ');
		}

		C.get(this.managerAlias, function(data){
			this.onGridStoreBeforeLoad();
			this.gridStore.loadData(data.getRange());
			// Apply callback
			if (callback) {
				callback.apply(scope);
			}
			this.onGridStoreLoad();
			this.unlock();
		}, this, params);
	},

/**
	* Returns true if list is currently in edit mode
	* @return {Boolean}
	*/
	isEditing: function() {
		return !!this.editedRecord;
	},

/**
	* Clears grid data
	*/
	clear: function() {
		this.gridStore.removeAll();
	},

/**
	* suspends display of created/updated messages
	*/
	suspendSuccessMessages: function() {
		this.displaySuccessMessages = false;
	},

/**
	* resumes display of created/updated messages
	*/
	resumeSuccessMessages: function() {
		this.displaySuccessMessages = true;
	}
});
