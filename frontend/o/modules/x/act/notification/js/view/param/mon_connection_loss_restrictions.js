/**
 * @class O.x.notification.param.MonConnectionLossRestrictions
 * @extends O.x.notification.param.Abstract
 */
Ext.define('O.x.notification.param.MonConnectionLossRestrictions', {
	extend: 'O.x.notification.param.Abstract',
	alias: 'widget.x-notification-param-mon_connection_loss_restrictions',

	/* visual config */
	config: {
		bodyPadding: 6
	},

/**
	* @constructor
	*/
	initComponent: function() {
		Ext.apply(this, {
			title: _('Notification settings'),
			layout: 'anchor',
			itemId: 'lossrestrictions',
			items: [{
				xtype: 'numberinterval',
				format: 'd:H:i',
				fieldLabel: _('Connection losed'),
				labelAlign: 'top',
				itemId: 'fieldLossTime',
				name: 'lossTime'
			}]
		});
		this.callParent(arguments);
		// init variables
		this.fieldLossTime = this.down('#fieldLossTime');
	}
});