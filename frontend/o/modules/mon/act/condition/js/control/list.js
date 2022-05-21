/**
 *
 * Panel with list of object groups
 * @class O.mon.act.condition.List
 * @extends O.lib.abstract.groupslist.Groups
 */
C.utils.inherit('O.mon.act.condition.List', {

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
		var data = this.splitByCondition(function(device){
			return !device.isLost();
		});
		var connected = data.resTrue;
		var lost = data.resFalse;

		this.updateVirtualGroup(C.utils.virtualGroups.CONNECTED,
			{ids: connected, count: connected.length});
		this.updateVirtualGroup(C.utils.virtualGroups.LOST,
			{ids: lost, count: lost.length});
	},

	/**
	 * Обновляет виртуальные группы связанные с наличием ошибки
	 */
	updateErrorGroups: function() {
		var data = this.splitByCondition(function(device){
			device = new Mon.device.Condition(device);
			return device.get('error_count') > 0;
		});

		var withError = data.resTrue;
		var withoutError = data.resFalse;

		this.updateVirtualGroup(C.utils.virtualGroups.WITH_ERRORS,
			{ids: withError, count: withError.length});
		this.updateVirtualGroup(C.utils.virtualGroups.WITHOUT_ERRORS,
			{ids: withoutError, count: withoutError.length});
	},

	/**
	 * Virtual groups initialization
	 * @private
	 */
	initVirtualGroups: function() {
		this.callParent(arguments);
		this.updateMovementGroups();
		this.updateErrorGroups();
	},

	/**
	 * Builds virtual groups array
	 * @return {Ext.util.MixedCollection}
	 */
	getVirtualGroups: function() {
		var virtualGroups = new Ext.util.MixedCollection();

		virtualGroups.addAll([{
			id: C.utils.virtualGroups.CONNECTED,
			name: _('Connected'),
			type: 'connected',
			weight: -10
		}, {
			id: C.utils.virtualGroups.LOST,
			name: _('Not connected'),
			type: 'lost',
			weight: -10
		}, {
			id: C.utils.virtualGroups.WITHOUT_ERRORS,
			name: _('Without errors'),
			type: 'without_errors',
			weight: -5
		}, {
			id: C.utils.virtualGroups.WITH_ERRORS,
			name: _('With errors'),
			type: 'with_errors',
			weight: -5
		}, {
			id: C.utils.virtualGroups.ALL,
			name: _('All'),
			type: 'all',
			weight: 100
		}]);

		return virtualGroups;
	},

	/**
	 * Insertion of data in virtual groups
	 * @param {Array} data Data array
	 */
	updateVirtualGroupsData: function(data) {
		this.callParent(arguments);
		this.updateMovementGroups();
		this.updateErrorGroups();
	},

	/**
	 * Gets moving devices
	 * @return {Number[]}
	 */
	splitByCondition: function(condition) {
		var resTrue = [],
			resFalse = [],
			devices = C.get('mon_device');
		if (devices) {
			devices.each(function(device) {
				// Skip not enabled
				if (device.state != C.cfg.RECORD_IS_ENABLED) {
					return true;
				}

				if (condition.call(this, device)) {
					resTrue.push(device.id);
				} else {
					resFalse.push(device.id);
				}
			});
		}
		return {resTrue: resTrue, resFalse: resFalse};
	}
});
