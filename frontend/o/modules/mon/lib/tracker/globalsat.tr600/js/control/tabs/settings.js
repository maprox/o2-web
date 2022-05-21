/**
 * @class O.mon.lib.tracker.globalsat.tr600.tab.Settings
 */
C.utils.inherit('O.mon.lib.tracker.globalsat.tr600.tab.Settings', {
/**
	* Returns true if this device has "angle change" property.
	* By default returns false.
	* @param {String} firmwareVersion Firmware version
	* @return {Boolean}
	*/
	hasAngleProperty: function(firmwareVersion) {
		return firmwareVersion && (
			firmwareVersion >= 'F-0TR-600OOO-12022352' ||  // GPS
			firmwareVersion >= 'F-0TR-60GOOO-12031351'     // GLONASS
		);
	}
});
