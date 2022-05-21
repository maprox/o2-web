/**
 * @class O.mon.lib.device.tab.Acces
 * @extends O.common.lib.modelslist.Tab
 */
Ext.define('O.mon.lib.device.tab.Access', {
	extend: 'O.common.lib.shareaccess.tab.Access',
	alias: 'widget.mon-lib-device-tab-access',

/**
	* Manager alias
	*/
	managerAlias: 'mon_device',

/**
	* @constructor
	*/
	initComponent: function() {
		this.callParent(arguments);
	}

});
