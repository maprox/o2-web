/**
 * @class O.mon.lib.device.tab.Connection
 * @extends O.common.lib.modelslist.Tab
 */
Ext.define('O.mon.lib.device.tab.Connection', {
	extend: 'O.mon.lib.device.tab.AbstractSettings',
	alias: 'widget.mon-lib-device-tab-connection',

/**
	* @cfg {String} settingsType
	* Alias for mon/lib/tracker/ parts + itemId
	*/
	settingsType: 'connection',

/**
	* @constructor
	*/
	initComponent: function() {
		Ext.apply(this, {
			title: _('Connection')
		});

		this.callParent(arguments);
	}
});
