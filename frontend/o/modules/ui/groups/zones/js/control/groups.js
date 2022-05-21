/**
 *
 * Panel with list of object groups
 * @class O.groups.zones.Groups
 * @extends O.lib.grouplist.Groups
 */
C.define('O.groups.zones.Groups', {
	extend: 'O.lib.grouplist.Groups',
	alias: 'widget.listgroupszones_groups',

/**
	* Component initialization
	*/
	initComponent: function() {
		this.callParent(arguments);
	},

/**
	* Virtual groups initialization
	* @private
	*/
	initVirtualGroups: function() {
		this.callParent(arguments);
		this.updateZoneGroups();
	},

/**
	* Insertion of data in virtual groups
	* @param {Array} data Data array
	*/
	updateVirtualGroupsData: function(data) {
		this.callParent(arguments);
		this.updateZoneGroups();
	},

/**
	* Updates zones wirtual groups
	*/
	updateZoneGroups: function() {
		this.updateVirtualGroup(C.utils.virtualGroups.NOTEMPTYZONE,
			this.getNotEmpty());
		this.updateVirtualGroup(C.utils.virtualGroups.EMPTYZONE,
			this.getEmpty());
	},

/**
	* Gets not empty geozones
	* @return {Number[]}
	*/
	getNotEmpty: function() {
		var ret = [];
		C.get('mon_geofence', function(zones) {
			zones.each(function(zone) {
				if (zone.inside.length > 0) {
					ret.push(zone.id);
				}
			});
		}, this);
		return ret;
	},

/**
	* Gets empty geozones
	* @return {Number[]}
	*/
	getEmpty: function() {
		var ret = [];
		C.get('mon_geofence', function(zones) {
			zones.each(function(zone) {
				if (zone.inside.length == 0) {
					ret.push(zone.id);
				}
			});
		}, this);
		return ret;
	},

/**
	* Builds virtual groups array
	* @return {Ext.util.MixedCollection}
	*/
	getVirtualGroups: function() {
		var virtualGroups = this.callParent(arguments);
		virtualGroups.addAll([{
			id: C.utils.virtualGroups.NOTEMPTYZONE,
			name: _('With devices'),
			type: 'notemptyzone',
			weight: -9
		}, {
			id: C.utils.virtualGroups.EMPTYZONE,
			name: _('Without devices'),
			type: 'emptyzone',
			weight: -10
		}]);
		return virtualGroups;
	}
});