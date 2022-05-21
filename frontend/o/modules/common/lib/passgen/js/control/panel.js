/**
 * @class O.common.lib.Passgen
 */
C.inherit('O.common.lib.Passgen', {

/**
	* @constructor
	*/
	initComponent: function() {
		this.callOverridden(arguments);
		this.btnPassgen.on('click', this.generatePassword, this);
		this.lastPasswordText = '';
	},

/**
	 * Bind password fields
	 * @param fields
	 */
	bindFields: function(fields) {
		var me = this;
		this.passwordFields = fields;

		// Bind events
		Ext.Array.each(this.passwordFields, function(f) {
			f.on('change', me.onFieldChange, me);
		}, this);
	},

/**
	 * On password field changes
	 */
	onFieldChange: function(field, newValue, oldValue, eOpts) {
		this.passStr.getEl().update(this.lastPasswordText);
		// TODO: seems to be spike-nail
		// how to make panel count height automatically?
		if (!this.lastPasswordText) {
			this.passStr.setHeight(0);
		} else {
			this.passStr.setHeight(20);
		}
		this.lastPasswordText = '';
	},

/**
	* Generates new password
	*/
	generatePassword: function() {
		var me = this;
		var password = C.utils.randomString();
		if (this.passwordFields) {
			Ext.Array.each(this.passwordFields, function(f) {
				me.lastPasswordText =
					_('Generated password')
					+ ': <strong>'
					+ password + '</strong>';
				f.setValue(password);
			});
		}
	}
});
