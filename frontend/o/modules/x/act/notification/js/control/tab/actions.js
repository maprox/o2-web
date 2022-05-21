/**
 * @class O.x.act.notification.tab.Actions
 */
C.utils.inherit('O.x.act.notification.tab.Actions', {
/**
	* @constructor
	*/
	initComponent: function() {
		this.callParent(arguments);

		this.dirty = false;

		Ext.each(this.actionPanels, function(statePanels) {
			Ext.each(statePanels, function(panel) {
				panel.on('change', 'checkDirty', this);
			}, this);
		}, this);

		this.on('afterrender', function() {
			this.applyValues();
		}, this, {
			single: true,
			delay: 1
		});
		// initial ui sync
		this.syncUi();
	},

/**
	 * Returns tags store for given alias
	 * @param alias Alias
	 */
	getTagsForAlias: function(alias) {
		var defaultStore = Ext.getStore('store-x_notification_alias');
		var store = Ext.create('Ext.data.Store', {
			fields: [{name: 'alias'}, {name: 'description'}],
			proxy: {type: 'memory'}
		});

		store.loadData(defaultStore.getRange());

		if (alias === 'mon_sensor_control') {
			store.add([{
				alias: '%SENSOR%',
				description: _('Sensor name')
			}, {
				alias: '%SENSOR_VALUE%',
				description: _('Sensor value')
			}]);
		}

		return store;
	},

/**
	* User interface syncronization.
	* Hides/shows param panels.
	*/
	syncUi: function() {
		var alias = this.notificationType;
		Ext.each(this.actionPanels, function(statePanels) {
			Ext.each(statePanels, function(panel) {
				if (!panel.getNotificationTypes) { return; }
				var aliases = panel.getNotificationTypes();
				var isVisible = Ext.isEmpty(aliases) ||
					Ext.Array.contains(aliases, alias);
				panel.setVisible(isVisible);
			}, this);
		}, this);

		// Sync messages texts
		// Default messages store
		var messageStore = C.getStore('x_notification_message');

		for (var i = 0; i < 2; i++) {
			var fieldName = 'message_' + i;
			var field = this.findField(fieldName);
			var message = messageStore.getById(alias + '_' + i);
			if (!field || !message) {
				field.setVisible(false);
				continue;
			}
			field.setVisible(true);
			field.setFieldLabel(message.get('title'));
			field.setValue(message.get('text'));
		}

		// Set titles and hide actions panels
		this.actionPanelsPanel0.applyTitle(alias);
		this.actionPanelsPanel1.applyTitle(alias);

		this.actionPanelsPanel0.show();
		this.actionPanelsPanel1.show();

		var tagStore = this.getTagsForAlias(alias);
		this.actionPanelsPanel0.tagsGrid.reconfigure(tagStore);
		this.actionPanelsPanel1.tagsGrid.reconfigure(tagStore);

		if (!Ext.Array.contains(
			this.actionPanelsPanel0.getNotificationTypes(),
			alias
		)) {
			this.actionPanelsPanel0.hide();
		}

		if (!Ext.Array.contains(
			this.actionPanelsPanel1.getNotificationTypes(),
			alias
		)) {
			this.actionPanelsPanel1.hide();
		}

	},

/**
	* Returns an action panel instance by its name
	* @param {String} name
	* @return Ext.Panel
	*/
	getActionPanel: function(name) {
		var panel = null;
		var xtype = this.actionPanelPrefix + name;
		Ext.each(this.actionPanels, function(actionPanel) {
			if (actionPanel.xtype == xtype) {
				panel = actionPanel;
				return false;
			}
		}, this);
		return panel;
	},

/**
	* Set notification type
	* @param {String} alias Notification type alias
	*/
	setNotificationType: function(alias) {
		this.notificationType = alias;
		this.syncUi();
	},

/**
	* Apply values for record into this form
	* @param {Object} values
	*/
	applyValues: function(values) {
		var record = this.getSelectedRecord();
		if (!record || !this.rendered) { return; }
		if (!values) {
			values = record.getData();
		}
		if (!values['actions']) { return; }
		var actions = values['actions'];
		// Separate actions by activate state
		var statefulActions = {
			0: [],
			1: []
		};
		Ext.each(actions, function(action) {
			if (action.activate_state === 1) {
				statefulActions[1].push(action);
			} else {
				statefulActions[0].push(action);
			}
		});

		Ext.each(this.actionPanels, function(statePanels, index) {
			Ext.each(statePanels, function(panel) {
				if (!panel.setValue) { return; }
				panel.setValue(statefulActions[index], true);
			}, this);
		}, this);

		this.checkDirty();
	},

/**
	* Loads data from record
	* @param {Ext.data.Model} record
	* @param {Boolean} noReset (optional) If true, use field.setValue method
	*     for forms to disable dirty change. Defaults to false
	*/
	selectRecord: function(record, noReset) {
		this.callParent(arguments);
		this.applyValues();
	},

/**
	* Retrieves the fields in the form as a set of key/value pairs, using
	* their {@link Ext.form.field.Field#getModelData getModelData()} method
	* to collect the values. If multiple fields return values under the same
	* name those values will be combined into an Array.
	* This is similar to {@link #getValues} except that this method collects
	* type-specific data values (e.g. Date objects for date fields) while
	* getValues returns only String values for submission.
	* @param {Boolean} dirtyOnly (optional) If true, only fields that are
	*     dirty will be included in the result. Defaults to false.
	* @return {Object}
	*/
	getFieldValues: function(dirtyOnly) {
		var values = this.callParent(arguments);
		//var values = {};
		if (!dirtyOnly || this.dirty) {
			values.actions = this.getFieldValue('actions');
		}
		return values;
	},

/**
	* Applies changes to tab fields
	* @param {Object} changes
	*/
	setFieldValues: function(changes) {
		this.callParent(arguments);
		return this.applyValues(changes);
	},

/**
	* Search for field value by fieldName in current tab
	* @param {String} fieldName
	* @return {Object}
	*/
	getFieldValue: function(fieldName) {
		if (fieldName === 'actions') {
			var actions = [];

			Ext.each(this.actionPanels, function(statePanels, index) {
				Ext.each(statePanels, function(panel) {
					if (!panel.getValue) { return; }
					var value = panel.getValue();
					if (value) {
						value.activate_state = index;
						actions = Ext.Array.merge(actions, value);
					}
				});
			});

			//return null;
			return actions;

			/*Ext.each(this.actionPanels, function(panel) {
				if (!panel.getValue) { return; }
				var value = panel.getValue();
				if (value) {
					actions = Ext.Array.merge(actions, panel.getValue());
				}
			}, this);
			return actions;*/
		}

		value = this.callParent(arguments);
		return value;
	},

/**
	* Updates record with form data
	* @param {Ext.data.Model} record
	*/
	updateRecord: function(record) {
		if (!record || !this.rendered) { return; }
		this.callParent(arguments);
		record.set('actions', this.getFieldValue('actions'));
	},

/**
	* Checks dirty state of current form
	* @return {Boolean}
	*/
	checkDirty: function() {
		//this.callParent(arguments);
		var record = this.getSelectedRecord();
		if (!record || !record.get('id')) {
			return;
		}
		var actions = this.getFieldValue('actions');
		var list = record.get('actions');

		if (record.modified && record.modified.actions) {
			list = record.modified.actions;
		}

		// Params may appear in different order and it causes wrong dirty
		var actionsCopy = C.utils.copy(actions);
		var listCopy = C.utils.copy(list);

		// Sort actions by id
		Ext.Array.sort(listCopy, function (a, b) {
			return a.id - b.id;
		});
		Ext.Array.sort(actionsCopy, function (a, b) {
			return a.id - b.id;
		});

		var toArray = function(item, index, arr) {
			var newParams = [];
			Ext.Array.forEach(item.params, function(param) {
				newParams.push(param.name + param.value);
			});
			// Sort and set newParams
			item.params = Ext.Array.sort(newParams);
		};
		if (Ext.isArray(actionsCopy)) {
			Ext.Array.forEach(actionsCopy, toArray);
		}
		if (Ext.isArray(listCopy)) {
			Ext.Array.forEach(listCopy, toArray);
		}
		this.removeIdentifiers(actionsCopy);
		this.removeIdentifiers(listCopy);
		var isDirty = !C.utils.equals(actionsCopy, listCopy);
		if (isDirty !== this.dirty) {
			this.dirty = isDirty;
			this.fireEvent('dirtychange');
		}
	},

/**
	* Method wich removes identifiers from list
	* @param {Object[]} list
	*/
	removeIdentifiers: function(list) {
		Ext.each(list, function(item) {
			if (item && item.id) {
				delete item.id;
			}
		});
	},

/**
	* Returns true if current tab data has changes
	* @return {Boolean}
	*/
	isDirty: function() {
		var dirty = this.callParent(arguments);
		return this.dirty || dirty;
	},

/**
	* Returns true if current tab data is valid
	* @return {Boolean}
	*/
	isValid: function() {
		return true;
	},

/**
	* Resets form data
	*/
	reset: function() {
		this.callParent(arguments);
		var record = this.getSelectedRecord();
		if (!record) { return; }
		record.reject();
		this.setFieldValues({
			actions: record.get('actions')
		});
	},

/**
	* Clears data
	*/
	clear: function() {
		this.callParent(arguments);
		this.setFieldValues({
			actions: []
		});
	}
});