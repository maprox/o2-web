/**
 * @class O.common.lib.usereditor.Tabs
 */
C.utils.inherit('O.common.lib.usereditor.Tabs', {
/**
	 * constructor
	 */
	initComponent: function() {
		this.callOverridden(arguments);

		if (this.btnSaveAndNotify) {
			this.btnSaveAndNotify.setHandler(this.btnSaveAndNotifyHandler, this);
		}
	},

/**
	* Activate save buttons
	*/
	syncUi: function() {
		var isDirty = this.isDirty();
		var isValid = this.isValid();
		var isValidForNotify = this.isValidForNotify();
		var isReadonly = this.isReadonly();

		if (this.btnSaveAndNotify) {
			this.btnSaveAndNotify
				.setDisabled(!(isValid && isDirty && isValidForNotify));
			this.btnSaveAndNotify.setVisible(!isReadonly);
		}

		this.callParent(arguments);
	},

/**
	* Check if we can notify user
	* Password and login should be not empty
	*/
	isValidForNotify: function() {
		var result = true;
		Ext.each(this.getTabs(), function(tab) {
			if (tab && tab.isValidForNotify && !tab.isValidForNotify()) {
				result = false;
				return false; // stops the iteration
			}
		});
		return result;
	},

/**
	* "Save" button click handler
	* @protected
	*/
	btnSaveAndNotifyHandler: function() {
		var record = this.getSelectedRecord();
		record.set('need_notify_user', 1);
		this.saveChanges();
		record.set('need_notify_user', 0);
	}
});
