/**
 *
 * @class O.ui.groups.Vehicles
 * @extends O.lib.grouplist.Panel
 */
C.define('O.ui.groups.Vehicles', {
	extend: 'O.lib.grouplist.Panel',
	alias: 'widget.listgroupsvehicles',

	//itemId: 'vehicles', // не работают нормально отчеты из-за одинаковых itemId
	title: 'Vehicles',

	config: {
		classAlias: 'mon_vehicle',
		groupsXtype: 'listgroupsvehicles_groups',
		objectsXtype: 'listgroupsvehicles_objects',
		deviceGroupsEnabled: true,
		showSelectAllObjects: true
	},

	/**
	 * Method wich returns a row class string for the specified record
	 * @param {Ext.data.Model} record
	 * @return {String}
	 */
	getRowClassObjects: function(record) {
		var rowClass = (record.get('disabled')) ?
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
