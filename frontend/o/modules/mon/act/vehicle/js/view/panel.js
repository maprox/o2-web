/**
 * Vehicle list
 * @class O.mon.vehicle.Panel
 * @extends O.common.lib.modelslist.Panel
 */
C.define('O.mon.vehicle.Panel', {
	extend: 'O.common.lib.modelslist.Panel',
	alias: 'widget.mon-vehicle',

	model: 'Mon.Vehicle',
	managerAlias: 'mon_vehicle',
	tabsAliases: [
		'mon-vehicle-tab-props',
		'mon-vehicle-tab-gallery'
	],
	listConfig: {
		xtype: 'mon-vehicle-list'
	}
});