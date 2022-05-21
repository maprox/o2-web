/**
 * @class O.x.notification.param.MonGeofenceRestrictions
 */
C.utils.inherit('O.x.notification.param.MonGeofenceRestrictions', {
/**
	* @constructor
	*/
	initComponent: function() {
		this.callParent(arguments);
		if (this.fieldCheckInGeofence) {
			this.fieldCheckInGeofence.on('change', 'onChange', this);
		}
	},

/**
	* Returns an array of notification types aliases, on wich
	* this param panel is visible during initialization of "Params" tab
	* @return String[]
	*/
	getNotificationTypes: function() {
		return [
			'mon_overspeed',
			'mon_alarm_button',
			'mon_sensor_control'
		];
	},

/**
	* Returns a value array for this parameter panel
	* Example: <pre>
	* [{
	*	"param": "mon_device",
	*	"value": 28
	* }, {
	*	"param": "x_group_mon_device",
	*	"value": 10
	* }]
	* </pre>
	* @return array
	*/
	getValue: function() {
		if (!this.fieldCheckInGeofence) { return []; }
		var check = this.fieldCheckInGeofence.getValue();
		if (check) {
			return [{
				name: 'check_in_geofence',
				value: check ? 1 : 0
			}];
		} else {
			return [];
		}
	},

/**
	* Set value for current parameter
	* @param {Object[]} value
	*/
	setValue: function(value) {
		if (!this.fieldCheckInGeofence) { return; }
		this.fieldCheckInGeofence.setValue(false);
		Ext.each(value, function(param) {
			if (param['name'] == 'check_in_geofence') {
				this.fieldCheckInGeofence.setValue(param['value']);
				return false;
			}
		}, this);
	}
});