/**
 * @class O.x.notification.param.MonSpeedRestrictions
 * @extends O.x.notification.param.Abstract
 */
Ext.define('O.x.notification.param.MonSpeedRestrictions', {
	extend: 'O.x.notification.param.Abstract',
	alias: 'widget.x-notification-param-mon_speed_restrictions',

	/* visual config */
	config: {
		itemId: 'speedrestrictions',
		bodyPadding: 6
	},

/**
	* @constructor
	*/
	initComponent: function() {
		Ext.apply(this, {
			title: _('Notification settings'),
			layout: 'anchor',
			items: [{
				xtype: 'checkboxfield',
				itemId: 'fieldNoNormalization',
				name: 'no_normalization',
				boxLabel: _("Don't notify about speed normalization")
			}]
		});
		this.callParent(arguments);
		// init variables
		this.fieldNoNormalization = this.down('#fieldNoNormalization');
	}
});