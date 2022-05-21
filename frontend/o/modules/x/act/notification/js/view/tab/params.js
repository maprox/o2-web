/**
 * @class O.x.act.notification.tab.Params
 * @extends O.common.lib.modelslist.Tab
 */
C.define('O.x.act.notification.tab.Params', {
	extend: 'O.common.lib.modelslist.Tab',
	alias: 'widget.x-notification-tab-params',

/**
	* @constructor
	*/
	initComponent: function() {
		this.paramPanelPrefix = 'x-notification-param-';
		Ext.apply(this, {
			title: _('Parameters'),
			iconCls: 'parameters',
			itemId: 'parameters',
			autoScroll: true,
			layout: {
				type: 'anchor'
			},
			defaults: {
				anchor: '100%',
				margin: '0 0 10 0'
			},
			items: [{
				xtype: this.paramPanelPrefix + 'mon_speed'
			}, {
				xtype: this.paramPanelPrefix + 'mon_device'
			}, {
				xtype: this.paramPanelPrefix + 'mon_geofence_restrictions'
			}, {
				xtype: this.paramPanelPrefix + 'mon_geofence'
			}, {
				xtype: this.paramPanelPrefix
					+ 'mon_connection_loss_restrictions'
			}]
		});
		this.callParent(arguments);
		// init variables
		this.paramPanels = this.query('panel[destiny=x-notification-param]');
	}
});
