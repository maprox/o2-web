/**
 * @class O.common.lib.modelslist.Tab
 */
C.utils.inherit('O.common.lib.modelslist.Tab', {
/**
	* @constructor
	*/
	initComponent: function() {
		this.callParent(arguments);
		var form = this.getForm();
		if (form) {
			form.trackResetOnLoad = true;
			this.relayEvents(form, [
				'dirtychange',
				'validitychange'
			]);
		}
	},

/**
	* Loads data from record
	* @param {Ext.data.Model} record
	* @param {Boolean} noReset (optional) If true, use field.setValue method
	*     for forms to disable dirty change. Defaults to false
	*/
	selectRecord: function(record, noReset) {
		var form = this.getForm();
		this.selectedRecord = record;
		if (record && record.data) {
			if (noReset) {
				form.trackResetOnLoad = false;
			}
			form.loadRecord(record);
			form.trackResetOnLoad = true;
		} else {
			form.reset();
		}

		// Check if another record selected
		var firstTime = false;
		if (record.get('id') && this.lastRecord
				&& record.getId() !== this.lastRecord.getId())
		{
			firstTime = true;
		}
		// Save lastloadedrecord
		this.lastRecord = record;

		this.fireEvent('recordload', this, record, noReset, firstTime);
	},

/**
	* Returns selected record
	* @return {Ext.data.Model}
	**/
	getSelectedRecord: function() {
		return this.selectedRecord;
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
		var form = this.getForm();
		return form ? form.getFieldValues(dirtyOnly) : {};
	},

/**
	* Applies changes to tab fields
	* @param {Object} changes
	*/
	setFieldValues: function(changes) {
		var form = this.getForm();
		if (!form) { return; }
		Ext.iterate(changes, function(fieldName, fieldValue) {
			var field = form.findField(fieldName);
			if (field && (field.getValue() != fieldValue)) {
				field.setValue(fieldValue);
			}
		});
	},

/**
	* Search for field value by fieldName in current tab
	* @param {String} fieldName
	* @return {Object}
	*/
	getFieldValue: function(fieldName) {
		var fieldValue = undefined;
		var field = this.getForm().findField(fieldName);
		if (field) {
			fieldValue = field.getValue();
		}
		return fieldValue;
	},

/**
	* Find a specific {@link Ext.form.field.Field} in this tab by id or name.
	* @param {String} id The value to search for (specify either a
	* {@link Ext.Component#id id} or
	* {@link Ext.form.field.Field#getName name or hiddenName}).
	* @return {Ext.form.field.Field} The first matching field, or
	*   `null` if none was found.
	*/
	findField: function(fieldName) {
		var form = this.getForm();
		return form ? form.findField(fieldName) : null;
	},

/**
	* Updates record with form data
	* @param {Ext.data.Model} record
	*/
	updateRecord: function(record) {
		if (!record) { return; }
		this.getForm().updateRecord(record);
	},

/**
	* Returns true if current tab data has changes
	* @return {Boolean}
	*/
	isDirty: function() {
		var form = this.getForm();
		return form ? form.isDirty() : false;
	},

/**
	* Returns true if current tab data is valid
	* @return {Boolean}
	*/
	isValid: function() {
		var form = this.getForm();
		return form ? form.isValid() : true;
	},

/**
	* Resets form data
	*/
	reset: function() {
		var form = this.getForm();
		if (form) {
			form.reset();
		}
	},

/**
	* Clears data
	*/
	clear: function() {
		var form = this.getForm();
		if (form) {
			form.clear();
		}
	}

});
