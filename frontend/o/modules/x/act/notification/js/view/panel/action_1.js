/**
 * @class O.x.act.notification.tab.Actions
 * @extends O.common.lib.modelslist.Tab
 */
C.define('O.x.act.notification.panel.Action1', {
	extend: 'O.x.act.notification.panel.AbstractAction',
	alias: 'widget.x-notification-panel-action-1',

	statePostfix: 1,

	/**
	 * Maps title to alias
	 */
	titlesMap: {
		'mon_geofence_inout': 'Entering geofence',
		'mon_overspeed': 'Speed is exceeded',
		'mon_alarm_button': 'Alarm button pressed',
		'mon_connection_loss': 'Conenction is reestablished',
		'mon_sensor_control': 'Sensor value is out of range',
		'mon_signal_loss': 'Satellite signal found'
	},

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
