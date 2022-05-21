/**
 * @class O.x.notification.param.MonGeofence
 */
C.utils.inherit('O.x.notification.param.MonGeofence', {
/**
	* Returns an array of notification types aliases, on wich
	* this param panel is visible during initialization of "Params" tab
	* @return String[]
	*/
	getNotificationTypes: function() {
		return [
			'mon_geofence_inout'
		];
	}
});