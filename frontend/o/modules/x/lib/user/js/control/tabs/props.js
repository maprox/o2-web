/**
 * @class O.common.lib.usereditor.tab.Props
 */
C.inherit('O.common.lib.usereditor.tab.Props', {
/**
	* @constructor
	*/
	initComponent: function() {
		this.callOverridden(arguments);
		if (this.btnGenerateApiKey) {
			this.btnGenerateApiKey.setHandler(this.generateApiKey, this);
		}
	},

/**
	* Loads data from record
	* @param {Ext.data.Model} record
	* @param {Boolean} noReset (optional) If true, use field.setValue method
	*     for forms to disable dirty change. Defaults to false
	*/
	selectRecord: function(record, noReset) {
		var hasLogin = record.get('login');
		if (this.fieldLogin) {
			this.fieldLogin.setDisabled(hasLogin);
		}
		if (this.fieldsetPassword) {
			this.fieldsetPassword.setExpanded(!hasLogin);
		}
		this.callParent(arguments);
	},

/**
	 * Checks if tab valid for user notifying
	 */
	isValidForNotify: function() {
		return !!(this.fieldLogin.getValue()
					&& this.fieldPassword.getValue()
					&& this.fieldPasswordConfirm.getValue()
				);
	},

/**
	* Generates api_key for user
	*/
	generateApiKey: function() {
		var field = this.findField('api_key');
		if (!field) { return; }
		var button = this.btnGenerateApiKey;
		button.setDisabled(true);
		Ext.Ajax.request({
			url: '/x_user/generateapikey',
			callback: function(request, result, response) {
				button.setDisabled(false);
				var answer = C.utils.getJSON(response.responseText);
				if (answer.key) {
					var value = answer.key;
					field.setValue(value);
				}
			}
		});
	}
});
