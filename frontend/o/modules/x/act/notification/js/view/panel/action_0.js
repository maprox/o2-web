/**
 * @class O.x.act.notification.tab.Actions
 * @extends O.common.lib.modelslist.Tab
 */
C.define('O.x.act.notification.panel.Action0', {
	extend: 'O.x.act.notification.panel.AbstractAction',
	alias: 'widget.x-notification-panel-action-0',

	statePostfix: 0,

	/**
	 * Maps title to alias
	 */
	titlesMap: {
		'mon_geofence_inout': 'Leaving geofence',
		'mon_overspeed': 'Speed is normalized',
		'mon_connection_loss': 'Connection loss',
		'mon_sensor_control': 'Sensor value normalized',
		'mon_signal_loss': 'Satellite signal loss'
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
			'mon_connection_loss',
			'mon_sensor_control',
			'mon_signal_loss'
		];
	}
});
