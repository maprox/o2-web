/**
 * @class O.mon.lib.device.tab.Sensors
 */
C.utils.inherit('O.mon.lib.device.tab.Sensors', {

/**
	* store changed flag
	*/
	sensorsDirty: false,

/**
	* Special dirty flag for temporary entry in grid
	*/
	newEntryDirty: false,

/**
	 * Is editor active
	 */
	isEditing: false,

/**
	* @constructor
	*/
	initComponent: function() {
		this.callOverridden(arguments);
		this.on({
			recordload: 'onRecordLoad',
			//afterload: 'onAfterRender',
			scope: this
		});

		if (this.winConv) {
			this.winConv.on('save', 'onSaveConversion', this);
		}

		if (this.sensorsGrid) {
			this.sensorsGrid.on('select', 'onSelectionChange', this);
			this.gridStore = this.sensorsGrid.getStore();
			this.editor = this.sensorsGrid.getPlugin('editor');
			// get grid editor plugin
			if (this.editor) {
				this.editor.on({
					beforeedit: 'onBeforeEdit',
					edit: 'onAfterEdit',
					canceledit: 'onCancelEdit',
					scope: this
				});
			}
		}

		if (this.btnSensorsAdd) {
			this.btnSensorsAdd.setHandler(this.addRecord, this);
		}
		if (this.btnSensorsOnOff) {
			this.btnSensorsOnOff.setHandler(this.onOffRecord, this);
		}
		if (this.btnSensorsConversions) {
			this.btnSensorsConversions.setHandler(
				this.onSensorsConversionsClick, this);
		}
		if (this.btnSensorsRemove) {
			this.btnSensorsRemove.setHandler(function() {
				this.removeRecord();
			}, this);
		}

		if (this.gridStore) {
			this.gridStore.on({
				remove: 'onStoreRemove', // Remove record handler
				update: 'onStoreUpdate', // Update record handler
				scope: this
			});
		}
	},

/**
	* Record loading handler
	*/
	onRecordLoad: function(cmp, record, noReset) {
		this.setAvailableSensorsForProtocol(record.get('protocol'));

		// Check if another record selected
		var firstTime = false;
		if (this.lastLoadedRecord
				&& record.getId() !== this.lastLoadedRecord.getId())
		{
			this.lastSelected = null;
			firstTime = true;
		}

		// Load access data to store
		this.lastLoadedRecord = record;

		if (!this.editor ||
			(!this.editor.editing && (!this.isDirty() || firstTime))) {
			this.loadSensors(firstTime);
		}
	},

/**
	* The new load sensors
	* @param firstTime
	*/
	loadSensors: function(firstTime) {
		if (!firstTime) {
			// Store selection
			this.storeSelection();
		}
		var record = this.getSelectedRecord();
		// Reset dirty flags for new entry
		this.newEntryDirty = false;
		this.sensorsDirty = false;
		this.fireEvent('dirtychange');

		// Clear store, load data
		this.gridStore.removeAll();
		var sensors = [];
		Ext.Array.each(record.get('sensor'), function(sensor) {
			if (sensor.state !== C.cfg.RECORD_IS_TRASHED) {
				sensors.push(sensor);
			}
		});

		this.gridStore.loadData(sensors);

		if (!firstTime) {
			// Restore selection
			this.restoreSelection();
		}
	},

/**
	* Cacnel edit
	*/
	onCancelEdit: function() {
		this.isEditing = false;
		var record = this.gridStore.getAt(0);
		if (record && !record.data.id) {
			this.gridStore.removeAt(0);
		}
	},

/**
	 * After edit handler
	 */
	onAfterEdit: function() {
		this.isEditing = false;
	},

/**
	 * Start edit event
	 */
	onBeforeEdit: function() {
		if (this.isEditing) {
			return false;
		} else {
			this.isEditing = true;
		}
	},

/**
	* grid selection change
	*/
	onSelectionChange: function(sm, selected) {
		var selected =
			this.sensorsGrid.getSelectionModel().getSelection();
		this.selected = selected[0];
		this.btnsEnable();
		this.onOffBtn();
		this.switchRemoveBtn();
	},

/**
	* Обработчик удаления строки
	*/
	onStoreRemove: function(store, record) {
		if (record.get('id')) {
			this.sensorsDirty = true;
			this.fireEvent('dirtychange');
		} else {
			this.newEntryDirty = false;
		}
	},

/**
	* Обработчик обновления строки
	*/
	onStoreUpdate: function(store) {
		this.sensorsDirty = this.storeChanged(store);
		this.fireEvent('dirtychange');
	},


/**
	* Checks if store has entries with dirty is true
	* @param {Object} store Store
	*/
	storeChanged: function(store) {
		var changed = false;
		store.each(function(record) {
			if (record.dirty === true) {
				changed = true;
			}
		});

		return changed;
	},

/**
	* Sensors conversions button handler
	*/
	onSensorsConversionsClick: function() {
		this.winConv.show();
		this.winConv.loadConversion(
			this.selected
		);
	},

/**
	* Resets data
	*/
	reset: function() {
		this.callParent(arguments);

		this.loadSensors();

		this.fireEvent('dirtychange');
	},

/**
	* Updates record
	* @param {Ext.data.Model} record
	*/
	updateRecord: function(record) {
		this.callParent(arguments);
		if (!record) { return; }

		if (this.sensorsDirty) {
			record['data'].sensor = this.getSensorsData();
			record['modified'].sensor = this.getSensorsData();
			this.sensorsDirty = false;
		}
	},

/**
	* Returns true if current tab has changes
	* @return {Boolean}
	*/
	isDirty: function() {
		return (
			this.getForm().isDirty() ||
			this.sensorsDirty //||
			//this.newEntryDirty
		);
	},

/**
	* Returns store data
	* @return {Object}
	*/
	getSensorsData: function() {
		var data = [];
		this.gridStore.each(function(record) {
			if (record.dirty) {
				data.push(record.data);
			}
		});
		return data;
	},

/**
	* Set available sensors for porotocl to combobox store
	* @param protocolId
	*/
	setAvailableSensorsForProtocol: function(protocolId) {
		// Remove all items
		this.sensorStore.removeAll();

		if (!protocolId) { return false; }
		var protocolStore = C.getStore('mon_device_protocol');
		var protocol = protocolStore.getById(protocolId);

		if (!protocol.get('sensors')) { return false; }
		this.sensorStore.loadData(protocol.get('sensors'));
	},

/**
	* Store selection
	*/
	storeSelection: function() {
		this.lastSelected = this.getSelectedSensor();
	},

/**
	* Returns selected sensor entry
	*/
	getSelectedSensor: function() {
		var selection = this.sensorsGrid.getSelectionModel().getSelection();
		if (selection.length > 0) {
			return selection[0];
		}

		return null;
	},

/**
	* Restores selection
	*/
	restoreSelection: function() {
		if (this.lastSelected) {
			var record = this.gridStore.getById(this.lastSelected.getId());
			if (record) {
				this.sensorsGrid.getSelectionModel().select(record);
			}
		}
	},

/**
	* Select record by id
	* @param {Intager} id record id
	*/
	selectById: function(id) {
		// All records
		var records = this.sensorsGrid.store.getRange();

		var len = records.length;
		for (var i = 0; i < len; i++) {
			if (records[i].getId() == id) {
				// Select record
				this.sensorsGrid.getSelectionModel().select(i);
			}
		}
	},

/**
	* Enable editing buttons
	*/
	btnsEnable: function() {
		this.down('#btnSensorsOnOff').enable();
		this.down('#btnSensorsRemove').enable();
		this.down('#btnSensorsConversions').enable();
	},

/**
	* Disable editing buttons
	*/
	btnsDisable: function() {
		this.down('#btnSensorsOnOff').disable();
		this.down('#btnSensorsRemove').disable();
		this.down('#btnSensorsConversions').disable();
	},

/**
	* Enable add button
	*/
	btnAddEnable: function() {
		this.down('#btnSensorsAdd').enable();
	},

/**
	* disable add button
	*/
	btnAddDisable: function() {
		this.down('#btnSensorsAdd').disable();
	},

/**
	* Returns selected record in a grid
	* @return {Ext.data.Model}
	*/
	getGridSelectedRecord: function() {
		var sm = this.sensorsGrid.getSelectionModel();
		if (sm) {
			var selection = sm.getSelection();
			if (selection.length > 0) {
				return selection[0];
			}
		}
		return null;
	},

/**
	* Add handler
	*/
	addRecord: function() {
		var store = this.gridStore;
		store.insert(0, {'state': 1, 'conversion': []});

		var record = store.getAt(0);
		this.editor.startEdit(record, 0);

		this.newEntryDirty = true;
		this.fireEvent('changed', store);
	},

/**
	* Change on/off button text
	*/
	onOffBtn: function() {
		// Get selected record
		var selected = this.sensorsGrid.getSelectionModel().getSelection();
		var record = selected[0];

		if (record.get('state') !== C.cfg.RECORD_IS_DISABLED) {
			this.down('#btnSensorsOnOff').setText(_('Disable'));
			this.down('#btnSensorsOnOff').setIconCls(this.offCls);
		} else {
			this.down('#btnSensorsOnOff').setText(_('Enable'));
			this.down('#btnSensorsOnOff').setIconCls(this.onCls);
		}
	},

/**
	* Changes remove button text
	*/
	switchRemoveBtn: function() {
		// Get selected record
		var selected = this.sensorsGrid.getSelectionModel().getSelection();
		// Is removed
		var removed = selected[0].get('state') == C.cfg.RECORD_IS_TRASHED;

		this.down('#btnSensorsRemove').setText(removed ?
			_('Restore') : _('Remove'));
		this.down('#btnSensorsRemove').setIconCls(removed ?
			this.onCls : this.remCls);
	},

/**
	* Disable/Enable sensor
	*/
	onOffRecord: function() {
		var me = this;
		// Get selected record
		var selected = this.sensorsGrid.getSelectionModel().getSelection();
		var record = selected[0];

		if (record.get('state') !== C.cfg.RECORD_IS_DISABLED) {
			record.set('state', C.cfg.RECORD_IS_DISABLED);
		} else {
			record.set('state', C.cfg.RECORD_IS_ENABLED);
		}

		this.onOffBtn();
		this.switchRemoveBtn();
	},

/**
	* Remove / restore handler
	*/
	removeRecord: function() {
		var record = this.sensorsGrid.getSelectionModel().getSelection();
		record = record[0];

		if (record.get('state') !== C.cfg.RECORD_IS_TRASHED) {
			record.set('state', C.cfg.RECORD_IS_TRASHED);
		} else {
			record.set('state', C.cfg.RECORD_IS_ENABLED);
		}

		var store = this.gridStore;
		//store.remove(selected);
		this.fireEvent('changed', store);
		this.switchRemoveBtn();
		this.onOffBtn();
	},

/**
	* Handler of saving sensor conversion.
	* @param {Object} window
	* @param {Object} record
	*/
	onSaveConversion: function(window, record) {
		var me = this;
		window.hide();
	}
});
