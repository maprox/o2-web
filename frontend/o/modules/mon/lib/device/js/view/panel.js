/**
 * Device list
 * @class O.mon.lib.device.Panel
 * @extends O.common.lib.modelslist.Panel
 */
Ext.define('O.mon.lib.device.Panel', {
	extend: 'O.common.lib.modelslist.Panel',
	alias: 'widget.mon-lib-device',

	model: 'Mon.Device',
	managerAlias: 'mon_device',
	tabsAliases: [
		'mon-lib-device-tab-props',
		'mon-lib-device-tab-connection',
		'mon-lib-device-tab-settings',
		'mon-lib-device-tab-sensors',
		'mon-lib-device-tab-access',
		'mon-lib-device-tab-commands',
		'mon-lib-device-tab-packets'
	],
	tabsConfig: {
		xtype: 'mon-lib-device-tabs'
	},
	listConfig: {
		xtype: 'mon-device-list'
	},
	idFirm: null
});
