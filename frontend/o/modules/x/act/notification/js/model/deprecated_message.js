/**
 * Notification message container
 * @class O.x.notification.model.Message
 * @singleton
 */
C.define('O.x.notification.model.Message', {
	singleton: true,
	data: {
		mon_geofence_inout: {
			message_0: {
				title: 'Message when leaving the geofence',
				text:
					'%DEVICE% left the geofence %ZONE% at %TIME% ' +
					'near %ADDRESS%. Its speed was %SPEED% kph.'
			},
			message_1: {
				title: 'Message at the entrance into a geofrence',
				text:
					'%DEVICE% entered the geofence %ZONE% at %TIME% ' +
					'near %ADDRESS%. Its speed was %SPEED% kph.'
			}
		},
		mon_connection_loss: {
			message_0: {
				title: 'Message when losing a connection',
				text:
					'%DEVICE% losed a connection at %TIME% ' +
					'near %ADDRESS%. Its speed was %SPEED% kph.'
			},
			message_1: {
				title: 'Message when restoring a connection',
				text:
					'%DEVICE% restored a connection at %TIME% ' +
					'near %ADDRESS%. Its speed was %SPEED% kph.'
			}
		}
	}
});