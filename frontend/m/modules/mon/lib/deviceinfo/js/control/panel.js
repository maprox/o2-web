/**
 * @copyright  2012, Maprox LLC
 */
/**
 * @class M.lib.deviceinfo.Panel
 */
C.utils.inherit('M.lib.deviceinfo.Panel', {
	/**
	 * @override
	 */
	initialize: function() {
		// call overridden
		this.callParent(arguments);
	},

/**
	* Sets device instance (or device identifier)
	* for displaying information about it
	* @param {O.mon.model.Device/Number} device
	*/
	setDevice: function(device) {
		this.panelInfo.setDevice(device);
		//this.eventsInfo.setDevice(device);
		if (this.panelCommands) {
			this.panelCommands.setDevice(device);
		}
	}
});
