/**
 * @class
 */
C.utils.inherit('O.mon.lib.tracker.common.tab.Connection', {
/**
	* Initialization
	*/
	initComponent: function() {
		this.callOverridden(arguments);
		var me = this;
		var fieldProvider = this.findField(this.itemId + '.provider');
		if (fieldProvider) {
			fieldProvider.on('change', 'onProviderChange', this);
		}
	},

/**
	* Fires when device provider is changed
	* @param {Ext.Component} cmp Changed field component
	* @param {Number} value
	*/
	onProviderChange: function(cmp, value) {
		var record = cmp.getStore().getById(value);
		if (record) {
			var field = this.findField(this.itemId + '.apn');
			if (field) { field.setValue(record.get('apn')); }
			field = this.findField(this.itemId + '.login');
			if (field) { field.setValue(record.get('login')); }
			field = this.findField(this.itemId + '.password');
			if (field) { field.setValue(record.get('password')); }
		}
	}
});
