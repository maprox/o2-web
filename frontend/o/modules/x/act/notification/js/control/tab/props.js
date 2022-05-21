/**
 * @class O.x.act.notification.tab.Props
 */
C.utils.inherit('O.x.act.notification.tab.Props', {
/**
	* @constructor
	*/
	initComponent: function() {
		this.callOverridden(arguments);
		// init variables
		var fieldType = this.findField('id_type');
		if (fieldType) {
			fieldType.on('change', 'onTypeChange', this);
		}
	},

/**
	* Fires when the type of the notification is changed
	* @param {Ext.form.Field} field
	* @param {Object} newValue
	* @param {Object} oldValue
	* @private
	*/
	onTypeChange: function(field, newValue, oldValue) {
		var alias = null;
		var store = field.getStore();
		if (store) {
			var record = store.getById(newValue);
			if (record) {
				alias = record.get('alias');
			}
		}
		this.fireEvent('actionrequest', 'typechange', {
			'alias': alias
		});
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
	* User interface syncronization.
	* Hides/shows param panels.
	*/
	syncUi: function() {
	}

});