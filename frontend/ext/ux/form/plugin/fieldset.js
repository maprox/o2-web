/**
 * @class Ext.form.FieldSet
 */

C.utils.inherit('Ext.form.FieldSet', {
	initComponent: function() {
		var result = this.callOverridden(arguments);
		this.addEvents('beforetoggled', 'toggled');
		return result;
	},

	setExpanded: function() {
		this.fireEvent('beforetoggled');
		var result = this.callOverridden(arguments);
		this.fireEvent('toggled');
		return result;
	}
});
