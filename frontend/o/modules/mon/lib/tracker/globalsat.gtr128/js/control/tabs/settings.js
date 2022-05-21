/**
 * @class O.mon.lib.tracker.globalsat.gtr128.tab.Settings
 */
C.utils.inherit('O.mon.lib.tracker.globalsat.gtr128.tab.Settings', {
/**
	* Returns true if this device has "angle change" property.
	* By default returns false.
	* @param {String} firmwareVersion Firmware version
	* @return {Boolean}
	*/
	hasAngleProperty: function(firmwareVersion) {
		return true;
	}
});
