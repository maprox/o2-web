/**
 *
 * Panel with list of object groups
 * @class O.groups.vehicles.Groups
 * @extends O.lib.grouplist.Groups
 */
C.define('O.groups.vehicles.Groups', {
	extend: 'O.lib.grouplist.Groups',
	alias: 'widget.listgroupsvehicles_groups',

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
	* Gets moving vehicles
	* @return {Number[]}
	*/
	getMoving: function() {
		return this.getByDeviceParam(function(d){
			return d.isMoving();
		});
	},

/**
	* Gets still vehicles
	* @return {Number[]}
	*/
	getStill: function() {
		return this.getByDeviceParam(function(d){
			return d.isStill();
		});
	},

/**
	* Gets lost vehicles
	* @return {Number[]}
	*/
	getLost: function() {
		return this.getByDeviceParam(function(d){
			return d.isLost();
		}, true);
	},

	/**
	 * Gets by callback on device
	 * @param {Function} callback
	 * @param {Boolean} addIfNoDevice
	 * @return {Number[]}
	 */
	getByDeviceParam: function(callback, addIfNoDevice) {
		var ret = [],
			vehicles = C.get('mon_vehicle');
		if (vehicles) {
			for (var i = 0; i < vehicles.length; i++) {
				var vehicle = vehicles.getAt(i);
				var device = false;
				if (vehicle.id_device) {
					device = C.get('mon_device').getByKey(vehicle.id_device);
				}

				if (!device && addIfNoDevice) {
					ret.push(vehicle.id);
				}

				if (device && callback.call(this, device)) {
					ret.push(vehicle.id);
				}
			}
		}
		return ret;
	}
});
