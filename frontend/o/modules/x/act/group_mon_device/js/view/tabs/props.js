/**
 * @class O.x.act.group_mon_device.tab.Props
 * @extends O.x.lib.group_abstract.tab.Props
 */
C.define('O.x.act.group_mon_device.tab.Props', {
	extend: 'O.x.lib.group_abstract.tab.Props',
	alias: 'widget.x-group-mon-device-tab-props',

/**
	* Entity alias (e.g. mon_device)
	*/
	entityAlias: 'mon_device',

/**
	 * Entity model (e.g. Mon.Device)
	 */
	entityModel: 'Mon.Device',

	tabTitle: 'Devices',

	includedTitle: 'Included devices',

	availableTitle: 'Available devices'
});
