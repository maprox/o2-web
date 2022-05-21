/**
 * Extended checkbox int value issue fix
 * @class Ext.form.field.Checkbox
 */
C.utils.inherit('Ext.form.field.Checkbox', {
	/**
	 * Checkbox int value fix.
	 * By default this method returns boolean
	 * (but we need 1 or 0 in our backend)
	 * @return {Number}
	 */
	getModelData: function() {
		var data = this.callParent(arguments);
		var name = this.getName();
		data[name] = data[name] ? 1 : 0;
		return data;
	},

	/**
	 * Returns true if the value of this Field has been changed from its {@link #originalValue}.
	 * Will always return false if the field is disabled.
	 *
	 * Note that if the owning {@link Ext.form.Basic form} was configured with
	 * {@link Ext.form.Basic#trackResetOnLoad trackResetOnLoad} then the {@link #originalValue} is updated when
	 * the values are loaded by {@link Ext.form.Basic}.{@link Ext.form.Basic#setValues setValues}.
	 * @return {Boolean} True if this field has been changed from its original value (and is not disabled),
	 * false otherwise.
	 */
	isDirty: function() {
		if (this.originalValue === null && this.getValue() === false) {
			return false;
		}
		return this.callParent(arguments);
	}
});