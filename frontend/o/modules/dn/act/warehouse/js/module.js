/**
 * Warehouse list module
 * @class O.dn.act.warehouse.Module
 * @extends C.ui.Module
 */
C.define('O.dn.act.warehouse.Module', {
	extend: 'C.ui.Module',

/**
	* Alias string for this module
	* @important "alias" is needed by Ext.ClassManager to find module class
	* @type String
	*/
	alias: 'module-dn-warehouse',

/**
	* Module identifier
	* Is used for storing and searching the module by its name
	* @type String
	*/
	id: 'dn-warehouse',
	
/**
	* Module type
	*/
	type: 'module',

/**
	* Module weight
	*/
	weight: 95,

/**
	* xtype of a panel (for modules with 'config' or 'module' type)
	* @type String
	*/
	panel: 'dn-warehouse',

/**
	* Short module name (for buttons, etc.)
	* @type String
	*/
	textShort: _('Warehouses'),

/**
	* Short description of module (for tooltips, etc.)
	* @type String
	*/
	textLong: _('Warehouses editor')

});