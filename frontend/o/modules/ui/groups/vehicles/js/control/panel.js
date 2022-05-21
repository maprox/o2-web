/**
 *
 * @class O.ui.groups.Vehicles
 */
C.utils.inherit('O.ui.groups.Vehicles', {

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
		C.get('x_group_mon_vehicle', function(groups) {
			this.listGroups.updateObjectsInGroups(groups);
		}, this);
	}
});
