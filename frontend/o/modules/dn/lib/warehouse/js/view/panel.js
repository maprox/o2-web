/**
 * Warehouse editor panel
 * @class O.dn.lib.warehouse.Panel
 * @extends O.common.lib.modelslist.Panel
 */
C.define('O.dn.lib.warehouse.Panel', {
	extend: 'O.common.lib.modelslist.Panel',
	alias: 'widget.dn-warehouse',

	model: 'Dn.Warehouse',
	managerAlias: 'dn_warehouse',

/**
	* Tabs aliases
	* @type String[]
	*/
	tabsAliases: [
		'dn-warehouse-tab-props',
		'dn-warehouse-tab-map'
	],

	tabsConfig: {
		xtype: 'dn-lib-warehouse-tabs'
	}
});