/**
 * @class O.common.lib.modelslist.Tabs
 */
C.utils.inherit('O.common.lib.modelslist.Tabs', {
/*
	lngSavedText: 'Changes were succesfully saved',
	lngFailedText: 'Error has occured, while saving',
	lngApplyRemoteChangesText:
		'Someone else has changed the entry you are currently editing. ' +
		'Discard your changes?',
*/
/**
	* @event create
	* Fires when item was created
	*/
/**
	* @event update
	* Fires when item was updated
	*/
/**
	* @event refresh
	* Fires when UI is resynced
	*/
/**
	* @event select
	* Fires after selecting a record
	*/

/**
	* @constructor
	*/
	initComponent: function() {
		this.callOverridden(arguments);
		if (this.btnSave) {
			this.btnSave.setHandler(this.btnSaveHandler, this);
		}
		if (this.btnReset) {
			this.btnReset.setHandler(this.btnResetHandler, this);
		}
		if (this.msgReadonly) {
			this.msgReadonly.setVisible(false);
		}
		this.on({
			validitychange: 'syncUi',
			dirtychange: 'syncUi',
			scope: this
		});
		// listen for changes
		this.defferedTabs = [];
		Ext.each(this.getTabs(), function(tab) {
			if (tab.defferedLoad) {
				this.defferedTabs.push(tab);
			}
			tab.on({
				validitychange: 'syncUi',
				dirtychange: 'syncUi',
				saverequest: 'onSaveRequest',
				defferedload: 'onDefferedTabLoad',
				actionrequest: 'onActionRequest',
				listlock: 'onListLock',
				scope: this
			});
		}, this);
		if (this.tabs) {
			this.relayEvents(this.tabs, ['beforetabchange', 'tabchange']);
		}
		// model update
		O.manager.Model.getCurator(this.managerAlias).addListener(
			'update', this.onAfterUpdate, this);
	},

/**
	* On list lock
	* @param Boolean lock
	*/
	onListLock: function(lock) {
		this.fireEvent('listlock', lock);
	},

/**
	 * On action request
	 */
	onActionRequest: function() {
	},

/**
	* Set firm id
	* @param {Integer} firmId
	*/
	setFirmId: function(firmId) {
		this.firmId = firmId;
		Ext.each(this.getTabs(), function(tab) {
			if (tab) {
				tab.firmId = firmId;
			}
		});
	},

/**
	* Creates tabs according to tabsAliases property
	* @return Object[]
	*/
	createTabs: function() {
		var tabs = [];
		Ext.each(this.tabsAliases, function(alias) {
			var params = (this.tabsParams ? this.tabsParams[alias] : {}) || {};
			if (params.condition !== false) {
				tabs.push(Ext.apply({
					xtype: alias
				}, params));
			}
		}, this);
		return tabs;
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
		if (record && !record.get('id')) {
			return false;
		}
		return (record && record.get('iseditable') === false);
	},

/**
	* Активировать кнопки сохранения
	*/
	syncUi: function() {
		var isDirty = this.isDirty();
		var isValid = this.isValid();
		var isReadonly = this.isReadonly();


		// hide buttons if needed
		if (this.msgReadonly) {
			this.msgReadonly.setVisible(isReadonly);
		}
		if (this.btnSave) {
			this.btnSave.setDisabled(!(isValid && isDirty));
			this.btnSave.setVisible(!isReadonly);
		}
		if (this.btnReset) {
			this.btnReset.setDisabled(!isDirty);
			this.btnReset.setVisible(!isReadonly);
		}
		// call refresh event
		this.fireEvent('refresh');
	},

/**
	* Model update event handler
	*/
	onAfterUpdate: function(objects) {
		var me = this;
		var selected = this.getSelectedRecord();
		if (!selected) { return; }
		if (selected.get('state') == C.cfg.RECORD_IS_TRASHED) {
			C.get(this.managerAlias, function(objects) {
				var selected = me.getSelectedRecord();
				var object = objects.getByKey(selected.getId());
				if (object && object.getRecord) {
					this.selectRecord(object.getRecord());
				} else {
					if (selected.get('state') == C.cfg.RECORD_IS_TRASHED) {
						this.clear();
						this.disable();
					}
				}
			}, this, {
				'$showtrashed': true,
				'$filter': 'state eq ' + C.cfg.RECORD_IS_TRASHED
			});
			return;
		}
	//	if (!this.firmId) {
			var params = this.managerIsJoined ? {'$joined': 1} : false;
			C.get(this.managerAlias, function(objects) {
				var selected = me.getSelectedRecord();
				var object = objects.getByKey(selected.getId());
				if (object && object.getRecord) {
					this.selectRecord(object.getRecord());
				} else {
					this.clear();
					this.disable();
				}
			}, this, params);
	//	}
	},

/**
	* On deffered tab Load
	*/
	onDefferedTabLoad: function() {
		this.defferedTabsCount--;
		if (this.defferedTabsCount <= 0) {
			this.fireEvent('aftertabsload');
		}
	},

/**
	* Select the record
	* @param {Ext.model.Record} record
	*/
	selectRecord: function(record) {
		if (record) {
			this.fireEvent('beforetabsload');
			this.defferedTabsCount = this.defferedTabs.length;
			if (this.defferedTabsCount == 0) {
				this.fireEvent('aftertabsload');
			}
		}
		var selected = this.getSelectedRecord();
		if (selected && /*selected.get('id') &&*/ record &&
			this.isDirty() && !this.isReadonly()) {

			var isRemoteUpdate = (record.getId() === selected.getId());
			if (isRemoteUpdate) {
				if (record.data) {
					// store changes to restore them later
					var changes = this.getChanges();
					selected.set(record.data);
					selected.commit();
					selected.set(changes);
				}
				this.loadRecord(selected, true);
				this.setChanges(changes);
			} else {
				var message =
					_('You are closing a tab that has unsaved changes.') +
					'<br/>' + _('Would you like to save your changes?');
				O.msg.confirm({
					msg: _(message),
					fn: function(choice) {
						if (choice === 'yes') {
							this.saveChanges();
						} else {
							selected.reject();
						}
						this.loadRecord(record);
						this.fireEvent('select', this, record);
					},
					scope: this
				});
			}
		} else {
			// rewrite to check all tabs
			this.loadRecord(record);
			this.fireEvent('select', this, record);
		}

		this.syncUi();
	},

/**
	* Returns changes, made in current record
	* @return {Object}
	*/
	getChanges: function() {
		var result = {};
		Ext.each(this.getTabs(), function(tab) {
			if (tab && tab.getFieldValues) {
				Ext.apply(result, tab.getFieldValues(true));
			}
		});
		return result;
	},

/**
	* Applies saved changes to tabs fields
	* @param {Object} changes
	*/
	setChanges: function(changes) {
		Ext.each(this.getTabs(), function(tab) {
			if (tab && tab.setFieldValues) {
				tab.setFieldValues(changes);
			}
		});
	},

/**
	* Check if record is changed
	* @return {Boolean}
	*/
	isDirty: function() {
		var result = false;
		Ext.each(this.getTabs(), function(tab) {
			if (tab && tab.isDirty && tab.isDirty()) {
				result = true;
				return false; // stops the iteration
			}
		});
		return result;
	},

/**
	* Check if record changes are valid
	* @return {Boolean}
	*/
	isValid: function() {
		var result = true;
		Ext.each(this.getTabs(), function(tab) {
			if (tab && tab.isValid && !tab.isValid()) {
				result = false;
				return false; // stops the iteration
			}
		});
		return result;
	},

/**
	* Returns tabs instances
	* @return Ext.Component[]
	*/
	getTabs: function() {
		return this.tabs.query('> panel');
	},

/**
	* Activates the first tab of the tab panel
	* @return {Ext.Component}
	*/
	selectFirstTab: function() {
		this.selectTab(0);
	},

/**
	* Activates the first tab of the tab panel
	* @param {Ext.Component} tab
	* @return {Ext.Component}
	*/
	selectTab: function(tab) {
		if (!this.tabs) { return null; }
		return this.tabs.setActiveTab(tab);
	},

/**
	* Set focus on the first field of the currently active tab
	*/
	focusField: function() {
		var tab = this.tabs.getActiveTab();
		if (!tab) { return; }
		var cmp = tab.down('textfield');
		if (cmp && cmp.focus) {
			cmp.focus(false, 100);
		}
	},

/**
	* Загрузка модели в табпанель
	* @param {Object} record Объект устройства
	* @param {Boolean} noReset (optional) If true, use field.setValue method
	*     for forms to disable dirty change. Defaults to false
	* @type {Function}
	*/
	loadRecord: function(record, noReset) {
		this.selected = record;
		if (!record) {
			this.clear();
			this.disable();
		} else {
			// load data into tabs
			this.enable();
			Ext.each(this.getTabs(), function(tab) {
				if (tab && tab.selectRecord) {
					tab.selectRecord(record, noReset);
				}
			}, this);
		}
	},

/**
	* Updates record with maden changes
	* @param {Ext.data.Model} record
	*/
	updateRecord: function(record) {
		Ext.each(this.getTabs(), function(tab) {
			if (tab && tab.updateRecord) {
				tab.updateRecord(record);
			}
		}, this);
	},

/**
	* Returns selected record
	* @return {Ext.data.Model}
	*/
	getSelectedRecord: function() {
		return this.selected;
	},

/**
	* Search for field value by fieldName in tabs
	* @param {String} fieldName
	* @return {Object}
	*/
	getFieldValue: function(fieldName) {
		var value = undefined;
		Ext.each(this.getTabs(), function(tab) {
			if (tab && tab.getFieldValue) {
				value = tab.getFieldValue(fieldName);
				if (value !== undefined) {
					// break the each loop
					return false;
				}
			}
		}, this);
		return value;
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
		record.fields.each(function(field) {
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
		});
		if (updatedProxies.length > 0) {
			C.get(updatedProxies, callback, scope);
		} else {
			callback.apply(scope || this);
		}
	},

/**
	* Saves changes in list of entities
	*/
	save: function(saveCallback, scope) {
		var record = this.getSelectedRecord();
		if (!record) { return; }
		// entity is changed
		var data = record.getSubmitData();

		if (C.utils.isEmptyObject(data)) {
			if (saveCallback) {
				saveCallback.apply(scope);
			}
			return;
		}
		this.lock();
		var isNewRecord = !record.getId();
		// create closure callback function

		var callback = function(success, packet) {
			// apply data if supplied
			if (packet && packet.data) {
				record.set(packet.data);
			}
			this.commitRecordData(record, success);
			// loads foreign proxies if foreign record was created

			this.loadForeignProxies(record, data, function() {
				if (record === this.getSelectedRecord()) {
					this.loadRecord(record);
				}
				this.syncUi();
				this.unlock();
				if (success) {
					O.msg.info(isNewRecord ?
						_('Created successfully') :
						_('Updated successfully'));
					this.fireEvent(isNewRecord ? 'create' : 'update',
						this, record, data, packet);
					if (saveCallback) {
						saveCallback.apply(scope);
					}
				}
			}, this);
		};
		if (!isNewRecord) {
			// because the id is not supplied via getChanges
			// we must add it manually
			data.id = record.getId();
		}
		if (this.firmId) {
			data.id_firm = this.firmId;
		}
		O.manager.Model[isNewRecord ? 'add' : 'set'](
			this.managerAlias, data, callback, this);
	},

	/**
	 * Writes changes to record
	 * @param {Ext.data.Model} record
	 * @param {Boolean} success
	 */
	commitRecordData: function(record, success) {
		(success) ? record.commit() : record.reject();
	},

/**
	* On save request
	*/
	onSaveRequest: function(callback, scope) {
		if (this.isValid()) {
			var record = this.getSelectedRecord();
			if (!record) { return; }
			this.updateRecord(record);
			this.save(callback, scope);
		}
	},

/**
	* Обработчик нажатия кнопки сохранения
	* @type {Function}
	*/
	saveChanges: function() {
		var record = this.getSelectedRecord();
		if (!record) { return; }
		this.updateRecord(record);
		this.save();
	},

/**
	* Reset changes
	*/
	resetChanges: function() {
		var selected = this.getSelectedRecord();
		if (selected) {
			selected.reject();
		}
		Ext.each(this.getTabs(), function(tab) {
			if (tab && tab.updateRecord) {
				tab.reset();
			}
		}, this);
	},

/**
	* Clears data
	*/
	clear: function() {
		Ext.each(this.getTabs(), function(tab) {
			if (tab && tab.clear) {
				tab.clear();
			}
		}, this);
	},

/**
	* "Save" button click handler
	* @protected
	*/
	btnSaveHandler: function() {
		this.saveChanges();
	},

/**
	* "Reset" button click handler
	* @protected
	*/
	btnResetHandler: function() {
		this.resetChanges();
	},

/**
	* Searches for field component by record field name in child tabs
	* @param {String} fieldName
	* @return {Ext.form.Field}
	*/
	findField: function(fieldName) {
		var field = null;
		Ext.each(this.getTabs(), function(tab) {
			if (tab && tab.findField) {
				field = tab.findField(fieldName);
				// if field is found - break iteration
				if (field) { return false; }
			}
		}, this);
		return field;
	}
});
