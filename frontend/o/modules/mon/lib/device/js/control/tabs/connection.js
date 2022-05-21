/**
 * @class O.mon.lib.device.tab.Connection
 */
C.utils.inherit('O.mon.lib.device.tab.Connection', {
/**
	* Initialization
	*/
	initComponent: function() {
		this.callOverridden(arguments);
	},

/**
	* update record
	*/
	updateRecord: function(record) {
		if (!record) { return; }
		this.callParent(arguments);

		// Set current imei
		var imeiField = this.getLayout().getActiveItem().getFields()
			.findBy(function(item) {
				var parts = item.name.split(".");
				return (parts[parts.length - 1] == 'identifier');
			});
		if (imeiField) {
			record.set('identifier', imeiField.value);
		} else {
			record.set('identifier', '');
		}
	}
});
