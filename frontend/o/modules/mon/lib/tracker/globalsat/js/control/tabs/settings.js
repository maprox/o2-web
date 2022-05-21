/**
 * @class
 */
C.utils.inherit('O.mon.lib.tracker.globalsat.tab.Settings', {
/**
	* Initialization
	*/
	initComponent: function() {
		this.callOverridden(arguments);
	},

/**
	* On record load
	*/
	onRecordLoad: function(t, record) {
		var fVersion = this.findField(this.itemId + '.version');
		var fAngle = this.findField(this.itemId + '.send_by_angle');
		if (fVersion && fAngle) {
			var firmwareVersion = fVersion.getValue();
			fAngle.setVisible(this.hasAngleProperty(firmwareVersion));
		}
		this.callParent(arguments);
	},

/**
	* Returns true if this device has "angle change" property.
	* By default returns false.
	* @param {String} firmwareVersion Firmware version
	* @return {Boolean}
	*/
	hasAngleProperty: function(firmwareVersion) {
		return false;
	}
});
