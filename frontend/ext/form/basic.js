/**
 * Extended basic form for working with nested model objects
 * @class Ext.form.Basic
 */
C.utils.inherit('Ext.form.Basic', {

/**
	* Updates record
	* @param {Ext.data.Model} record
	*/
	updateRecord: function(record) {
		record = record || this._record;
		if (!record) {
			//<debug>
			Ext.Error.raise("A record is required.");
			//</debug>
			return this;
		}

		record.beginEdit();
		record.set(this.getFieldValues(true));
		record.endEdit();

		return this;
	},

/**
	* Override of setValues to support objects
	*/
	setValues: function(values) {
		var me = this;
		var maxDepth = 3;
		// additional clearing of all fields
		this.clear();

		var setVal = function(fieldId, val) {
			if (!Ext.isObject(val)) {
				var field = me.findField(fieldId);
				if (field) {
					if (field.$className === "Ext.form.field.Checkbox") {
						// checkbox fix
						val = val + '';
					}
					if (field.$className === "Ext.form.field.ComboBox") {
						// combobox store filter fix
						if (field.editable) {
							field.store.clearFilter();
						}
					}
					field.setValue(val);
					if (me.trackResetOnLoad) {
						field.resetOriginalValue();
					}
				}
			} else {
				if (fieldId.split('.').length - 1 < maxDepth) {
					for (var key in val) {
						if (val.hasOwnProperty(key)) {
							setVal(fieldId + '.' + key, val[key]);
						}
					}
				}
			}
		}

		if (Ext.isArray(values)) {
			for (var i = 0; i < values.length; i++) {
				var val = values[i];
				setVal(val.id, val.value);
			}
		} else {
			Ext.iterate(values, setVal);
		}

		return this;
	},

	/**
	 * Clears form fields
	 */
	clear: function() {
		var me = this;
		this.getFields().each(function(field) {
			field.setValue('');
			if (me.trackResetOnLoad) {
				field.resetOriginalValue();
			}
		});
	},

	/**
	 * Does form have
	 */
	isWaiting: function() {
		var result = false;
		this.getFields().each(function(field) {
			if (field.isWaiting) {
				result = true;
				return false;
			}
		});

		return result;
	}

});
