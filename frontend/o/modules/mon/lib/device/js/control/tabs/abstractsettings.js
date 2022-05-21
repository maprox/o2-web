/**
 * @class O.mon.lib.device.tab.Connection
 */
C.utils.inherit('O.mon.lib.device.tab.AbstractSettings', {
/**
	* Initialization
	*/
	initComponent: function() {
		this.callOverridden(arguments);
		this.on('recordload', this.onRecordLoad, this);
	},

/**
	* Loads data from record
	*/
	onRecordLoad: function(cmp, record) {
		if (this.tabs) {
			// Call on RecordLoad on each tab
			Ext.Array.each(this.tabs, function(tab, index) {
				tab.onRecordLoad(tab, record);
			});
		}
	},

/**
	* update record
	*/
	updateRecord: function(record) {
		if (!record) { return; }
		var settings = Ext.JSON.decode(record.get('settings'));
		if (!settings || Ext.isArray(settings)) {
			settings = {};
		}
		if (!settings.common) {
			settings.common = {};
		}
		var common = C.utils.copy(settings.common);
		Ext.Array.each(this.tabs, function(tab, index) {
			if (!Ext.isDefined(settings[tab.itemId])) {
				settings[tab.itemId] = {};
			}
			tab.getFields().each(function(field) {
				var parts = field.name.split(".");
				var isCommon = (parts[0] == 'common');
				var name = parts[parts.length - 1];
				var part = isCommon ?
					settings.common : settings[tab.itemId];
				if (
					(
						field.getValue()
						|| part[name]
					) && (
						!isCommon
						|| (common[name] ? common[name] : '') !=
							(field.getValue() ? field.getValue() : '')
					)
				) {
					part[name] = field.getValue();
				}
			});
			if (C.utils.isEmptyObject(settings[tab.itemId])) {
				delete settings[tab.itemId];
			}
		});
		record.set('settings', Ext.JSON.encode(settings));
	}
});
