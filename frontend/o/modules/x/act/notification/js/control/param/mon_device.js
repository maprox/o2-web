/**
 * @class O.x.notification.param.MonDevice
 */
C.utils.inherit('O.x.notification.param.MonDevice', {
/**
	* Returns an array of notification types aliases, on wich
	* this param panel is visible during initialization of "Params" tab
	* @return String[]
	*/
	getNotificationTypes: function() {
		return [
			'mon_geofence_inout',
			'mon_overspeed',
			'mon_alarm_button',
			'mon_connection_loss',
			'mon_sensor_control',
			'mon_signal_loss'
		];
	}
});