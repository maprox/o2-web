/**
 * Vehicle list
 * @class O.mon.vehicle.List
 * @extends O.common.lib.modelslist.List
 */
C.utils.inherit('O.mon.vehicle.List', {
	/**
	* Start edit event
	*/
	beforeEdit: function() {
		// Disable editing
		if (!this.newRecord) {
			return false;
		}
		this.callParent(arguments);
	}
});