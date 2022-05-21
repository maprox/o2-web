/**
 * @class
 */
C.utils.inherit('O.mon.lib.tracker.abstract.tab.Abstract', {
/**
	* Loads data from record
	*/
	onRecordLoad: function(tab, record) {
		// Getting settings for current tracker (alias specified in itemId)

		if (!record.get('settings')) {
			return;
		}
		var settings = Ext.JSON.decode(record.get('settings'));

		var common = {};
		if (settings && settings['common']) {
			common = settings['common'];
		}

		if (settings && settings[this.itemId]) {
			settings = settings[this.itemId];
		} else {
			settings = {};
		}

		// Fill tab fields with settings
		this.getFields().each(function(field, index) {
			var parts = field.name.split('.')
			var isCommon = parts[0] == 'common';
			var settingName = parts[parts.length - 1];
			var settingValue = isCommon ? common[settingName] :
				settings[settingName];
			if (settingValue) {
				if (!field.is('checkbox')) {
					field.setRawValue(settingValue);
				}
				field.originalValue = settingValue;
			}
		});
		// !
		this.getForm().reset();
	},

/**
	* Get current tab fields
	*/
	getFields: function() {
		return this.getForm().getFields();
	}
});
