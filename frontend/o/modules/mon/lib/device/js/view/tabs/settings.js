/**
 * @class O.mon.lib.device.tab.Settings
 * @extends O.common.lib.modelslist.Tab
 */
Ext.define('O.mon.lib.device.tab.Settings', {
	extend: 'O.mon.lib.device.tab.AbstractSettings',
	alias: 'widget.mon-lib-device-tab-settings',

/**
	* @cfg {String} settingsType
	* Alias for mon/lib/tracker/ parts + itemId
	*/
	settingsType: 'settings',

/**
	* @constructor
	*/
	initComponent: function() {
		Ext.apply(this, {
			title: _('Settings')
		});

		this.callParent(arguments);
	}
});
