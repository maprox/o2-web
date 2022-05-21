/**
 * @class O.x.act.notification.tab.Params
 */
C.utils.inherit('O.x.act.notification.tab.Params', {
/**
	* @constructor
	*/
	initComponent: function() {
		this.callOverridden(arguments);
		var checkInGeofence = this.findField('check_in_geofence');
		if (checkInGeofence) {
			checkInGeofence.on('change', 'onCheckInGeofenceChange', this);
		}
		Ext.each(this.paramPanels, function(panel) {
			panel.on('change', 'checkDirty', this);
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
	* User interface syncronization.
	* Hides/shows param panels.
	*/
	syncUi: function() {
		var alias = this.notificationType;
		Ext.each(this.paramPanels, function(panel) {
			if (!panel.getNotificationTypes) { return; }
			var aliases = panel.getNotificationTypes();
			var isVisible = Ext.isEmpty(aliases) ||
				Ext.Array.contains(aliases, alias);
			panel.setVisible(isVisible);
		}, this);
	},

/**
	* Returns a param panel instance by its name
	* @param {String} name
	* @return Ext.Panel
	*/
	getParamPanel: function(name) {
		var panel = null;
		var xtype = this.paramPanelPrefix + name;
		Ext.each(this.paramPanels, function(paramPanel) {
			if (paramPanel.xtype == xtype) {
				panel = paramPanel;
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
	* Handles changing of check_in_geofence checkbox value
	* @param {Ext.form.Field} field
	* @param {Object} value
	* @private
	*/
	onCheckInGeofenceChange: function(field, value) {
		var panelGeofences = this.getParamPanel('mon_geofence');
		if (panelGeofences) {
			panelGeofences.setVisible(value);
		}
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
		if (!values['params']) { return; }
		var params = values['params'];
		Ext.each(this.paramPanels, function(panel) {
			if (!panel.setValue) { return; }
			panel.setValue(params);
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
		var values = {};
		if (!dirtyOnly || this.dirty) {
			values.params = this.getFieldValue('params');
		}
		return values;
	},

/**
	* Applies changes to tab fields
	* @param {Object} changes
	*/
	setFieldValues: function(changes) {
		return this.applyValues(changes);
	},

/**
	* Search for field value by fieldName in current tab
	* @param {String} fieldName
	* @return {Object}
	*/
	getFieldValue: function(fieldName) {
		if (fieldName === 'params') {
			var params = [];
			Ext.each(this.paramPanels, function(panel) {
				if (!panel.getValue) { return; }
				params = Ext.Array.merge(params, panel.getValue());
			}, this);
			return params;
		}
		return null;
	},

/**
	* Updates record with form data
	* @param {Ext.data.Model} record
	*/
	updateRecord: function(record) {
		if (!record || !this.rendered) { return; }
		record.set('params', this.getFieldValue('params'));
	},

/**
	* Checks dirty state of current form
	* @return {Boolean}
	*/
	checkDirty: function() {
		var record = this.getSelectedRecord();
		if (!record) { return; }
		var params = this.getFieldValue('params');
		var list = record.get('params');
		if (record.modified && record.modified.params) {
			list = record.modified.params;
		}
		var isDirty = !C.utils.equals(params, list);
		if (isDirty !== this.dirty) {
			this.dirty = isDirty;
			this.fireEvent('dirtychange');
		}
	},

/**
	* Returns true if current tab data has changes
	* @return {Boolean}
	*/
	isDirty: function() {
		return this.dirty;
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
		var record = this.getSelectedRecord();
		if (!record) { return; }
		record.reject();
		this.setFieldValues({
			params: record.get('params')
		});
	},

/**
	* Clears data
	*/
	clear: function() {
		this.setFieldValues({
			params: []
		});
	}

});