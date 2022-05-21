/**
 *
 * @class O.ui.groups.Devices
 * @extends O.lib.grouplist.Panel
 */
C.define('O.ui.groups.Devices', {
	extend: 'O.lib.grouplist.Panel',
	alias: 'widget.listgroupsdevices',

	//itemId: 'devices', // не работают нормально отчеты из-за одинаковых itemId
	title: 'Devices',

	config: {
		classAlias: 'mon_device',

		deviceGroupsEnabled: true,
		groupsXtype: 'listgroupsdevices_groups',
		objectsXtype: 'listgroupsdevices_objects',

		showSelectAllObjects: true
	},

/**
	* Method wich returns a row class string for the specified record
	* @param {Ext.data.Model} record
	* @return {String}
	*/
	getRowClassObjects: function(record) {
		var devices = C.get('mon_device');
		var device = devices ? devices.getByKey(record.getId()) : null;
		var rowClass = (device && device.isUnconfigured()) ?
			'uncheckable inactive' : '';
		return rowClass + ' ' + this.callParent(arguments);
	},

/**
	* Returns config for groups list
	* @return {Object}
	*/
	getGroupConfig: function() {
		var config = this.callParent(arguments);
		config.deviceGroupsEnabled = this.getDeviceGroupsEnabled();
		return config;
	}

});
