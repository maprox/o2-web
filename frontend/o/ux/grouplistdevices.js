/**
 * Global object for message handling
 * @class O.ux.GrouplistDevices
 */
Ext.define('O.ux.GrouplistDevices', {

	init: function(list) {
		this.list = list;
		if (!this.list) {
			return;
		}
		this.objects = list.down('groupslist_objects');
		if (!this.objects) {
			return;
		}
		this.grid = this.objects.down('gridpanel');
		this.store = this.grid.getStore();
		this.store.on({
			datachanged: this.onStoreDataChanged,
			scope: this
		});
	},

	onStoreDataChanged: function() {
		var devices = this.store.getRange();
		/*for (var i = 0, l = devices.length; i < l; i++) {
			
		}*/
	}
});
