/**
 *
 * Panel with list of object groups
 * @class O.groups.devices.Groups
 * @extends O.lib.grouplist.Groups
 */
C.define('O.groups.devices.Groups', {
	extend: 'O.lib.grouplist.Groups',
	alias: 'widget.listgroupsdevices_groups',

/**
	* Component initialization
	*/
	initComponent: function() {
		this.callParent(arguments);
		C.bind('clock10', this);
	},

/**
	* Обновляемся каждый раз на лоадере, проверяем состояние машин в виртуальных группах
	*/
	onUpdateClock10: function() {
		this.updateMovementGroups();
		this.reload();
	},

/**
	* Обновляет виртуальные группы связанные с движением
	*/
	updateMovementGroups: function() {
		this.updateVirtualGroup(C.utils.virtualGroups.MOVING, this.getMoving());
		this.updateVirtualGroup(C.utils.virtualGroups.STILL, this.getStill());
		this.updateVirtualGroup(C.utils.virtualGroups.LOST, this.getLost());
	},

/**
	* Virtual groups initialization
	* @private
	*/
	initVirtualGroups: function() {
		this.callParent(arguments);
		this.updateMovementGroups();
	},

/**
	* Builds virtual groups array
	* @return {Ext.util.MixedCollection}
	*/
	getVirtualGroups: function() {
		var virtualGroups = this.callParent(arguments);
		if (this.deviceGroupsEnabled) {
			virtualGroups.addAll([{
				id: C.utils.virtualGroups.MOVING,
				name: _('Moving'),
				type: 'moving',
				weight: -10
			}, {
				id: C.utils.virtualGroups.STILL,
				name: _('Still'),
				type: 'still',
				weight: -10
			}, {
				id: C.utils.virtualGroups.LOST,
				name: _('Lost'),
				type: 'lost',
				weight: -10
			}]);
		}
		return virtualGroups;
	},

/**
	* Insertion of data in virtual groups
	* @param {Array} data Data array
	*/
	updateVirtualGroupsData: function(data) {
		this.callParent(arguments);
		this.updateMovementGroups();
	},

/**
	* Gets moving devices
	* @return {Number[]}
	*/
	getMoving: function() {
		var ret = [],
			devices = C.get('mon_device');
		if (devices) {
			for (var i = 0; i < devices.length; i++) {
				var device = devices.getAt(i);
				if (device.isMoving()) {
					ret.push(device.id);
				}
			}
		}
		return ret;
	},

/**
	* Gets still devices
	* @return {Number[]}
	*/
	getStill: function() {
		var ret = [],
			devices = C.get('mon_device');
		if (devices) {
			for (var i = 0; i < devices.length; i++) {
				var device = devices.getAt(i);
				if (device.isStill()) {
					ret.push(device.id);
				}
			}
		}
		return ret;
	},

/**
	* Gets lost devices
	* @return {Number[]}
	*/
	getLost: function() {
		var ret = [],
			devices = C.get('mon_device');
		if (devices) {
			for (var i = 0; i < devices.length; i++) {
				var device = devices.getAt(i);
				if (device.isLost()) {
					ret.push(device.id);
				}
			}
		}
		return ret;
	}
});
