/**
 * @class O.x.notification.param.MonGeofenceRestrictions
 * @extends O.x.notification.param.Abstract
 */
Ext.define('O.x.notification.param.MonGeofenceRestrictions', {
	extend: 'O.x.notification.param.Abstract',
	alias: 'widget.x-notification-param-mon_geofence_restrictions',

	/* visual config */
	config: {
		itemId: 'restrictions',
		bodyPadding: 6
	},

/**
	* @constructor
	*/
	initComponent: function() {
		Ext.apply(this, {
			title: _('Restrictions'),
			layout: 'anchor',
			items: [{
				xtype: 'checkboxfield',
				itemId: 'fieldCheckInGeofence',
				name: 'check_in_geofence',
				boxLabel: _('Check only in selected geofences')
			}]
		});
		this.callParent(arguments);
		// init variables
		this.fieldCheckInGeofence = this.down('#fieldCheckInGeofence');
	}
});