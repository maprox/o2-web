/**
 * @copyright  2012, Maprox LLC
 */
/**
 * Map device info panel
 * @class M.lib.deviceinfo.Panel
 * @extend M.kernel.ui.CardPanel
 */
Ext.define('M.lib.deviceinfo.Panel', {
	extend: 'M.kernel.ui.CardPanel',
	alias: 'widget.deviceinfooverlay',

/** Configuration */
	config: {
		width: 280,
		height: '80%',
//		scrollable: true,
		cls: 'x-static deviceinfo'
	},

	/**
	 * @construct
	 */
	initialize: function() {

		var items = [{
			xtype: 'deviceinfo-infopanel',
			title: _('Information'),
			itemAlias: 'info'
		}/*, {
			xtype: 'panel',
			title: _('Events'),
			alias: 'events',
			html: _('<br/>In development')
		}*/ ];

		if (C.userHasRight('mon_device_command_template')) {
			items.push({
				xtype: 'deviceinfo-commandspanel',
				title: _('Commands'),
				itemAlias: 'commands'
			});
		}

		this.setItems(items);
		// call parent
		this.callParent(arguments);

		this.panelInfo = this.down('deviceinfo-infopanel');
		this.panelEvents = this.down('deviceinfo-eventspanel');
		this.panelCommands = this.down('deviceinfo-commandspanel');
	}
});
