/**
 * Extended combobox reset issue fix
 * @class Ext.form.field.ComboBox
 */
C.utils.inherit('Ext.form.field.ComboBox', {
/**
	* Resets the current field value to the originally-loaded value
	* and clears any validation messages.
	* Also adds **{@link #emptyText}** and **{@link #emptyCls}** if the
	* original value was blank.
	*/
	reset: function() {
		if (this.editable) {
			this.store.clearFilter();
		}
		this.callOverridden(arguments);
	},

/**
	* @private Generates the string value to be displayed in the
	* text field for the currently stored value
	*/
	getDisplayValue: function() {
		if (!this.editable ||
			this.simpleText ||
			//Ext.isString(this.value) ||
			// DIRTY hack for Ext.form.field.TimeView
			// I think we need to override it and add simpleText flag.
			(this.valueField == 'date')
		) {
			return this.displayTpl.apply(this.displayTplData);
		} else {
			var record = this.findRecordByValue(this.value);
			return record ? this.displayTpl.apply(this.displayTplData) : '';
		}
	},

/**
	* Returns changed model data
	* @private
	*/
	getModelData: function() {
		var data = null;
		var name = this.getName();
		if (!this.simpleText) {
			if (!this.findRecordByValue(this.value)) {
				name += C.cfg.newFieldPostfix;
			}
		}
		if (!this.disabled && !this.isFileUpload()) {
			data = {};
			data[name] = this.getValue();
		}
		return data;
	}
});