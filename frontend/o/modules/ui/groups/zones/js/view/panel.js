/**
 *
 * @class O.ui.groups.Zones
 * @extends O.lib.grouplist.Panel
 */
C.define('O.ui.groups.Zones', {
	extend: 'O.lib.grouplist.Panel',
	alias: 'widget.listgroupszones',

	itemId: 'zones',
	title: 'Zones',

	config: {
		classAlias: 'mon_geofence',
		groupsXtype: 'listgroupszones_groups',
		objectsXtype: 'listgroupszones_objects',
		showSelectAllObjects: true
	},

	/**
	 * Method wich returns a row class string for the specified record
	 * @param {Ext.data.Model} record
	 * @return {String}
	 */
	getRowClassObjects: function(record) {
		var rowClass = '';
		var fence = C.get('mon_geofence').getByKey(record.getId());
		if (!fence || !fence.center_lat || !fence.center_lon) {
			rowClass = 'inactive uncheckable';
		}
		return rowClass + ' ' + this.callParent(arguments);
	}
});