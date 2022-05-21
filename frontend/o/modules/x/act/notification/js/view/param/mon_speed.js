/**
 * @class O.x.notification.param.MonSpeed
 * @extends O.x.notification.param.Abstract
 */
Ext.define('O.x.notification.param.MonSpeed', {
	extend: 'O.x.notification.param.Abstract',
	alias: 'widget.x-notification-param-mon_speed',

/**
	* @constructor
	*/
	initComponent: function() {
		Ext.apply(this, {
			title: _('Top speed'),
			layout: 'anchor',
			itemId: 'speed',
			dockedItems: [{
				xtype: 'toolbar',
				dock: 'top',
				items: [{
					xtype: 'numberfield',
					itemId: 'fieldSpeed',
					width: 100
				}, {
					xtype: 'tbtext',
					text: _('Kph')
				}]
			}]
		});
		this.callParent(arguments);
		// init variables
		this.fieldSpeed = this.down('#fieldSpeed');
	}
});