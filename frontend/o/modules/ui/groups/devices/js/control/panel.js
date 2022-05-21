/**
 *
 * @class O.ui.groups.Devices
 */
C.utils.inherit('O.ui.groups.Devices', {

/**
	* Component initialization
	*/
	initComponent: function() {
		this.callOverridden();
		C.bind('clock10', this);
	},

/**
	* Data reload on sync (virtual groups may have changed)
	*/
	onUpdateClock10: function() {
		C.get('x_group_mon_device', function(groups) {
			//var viewedGroups = groups.filter('isshared', true);
			this.listGroups.updateObjectsInGroups(groups);
		}, this);
	},

/**
	* Returns @true if object can be checked
	* @param {Ext.data.Model} record GroupedObject record
	* @return {Boolean}
	*/
	canCheckObject: function(record) {
		var devices = C.get('mon_device');
		if (devices) {
			var device = devices.getByKey(record.getId());
			return !device.isUnconfigured();
		}
		return false;
	}

});
