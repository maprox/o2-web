/**
 *
 * Product supply panel
 * @class O.ui.module.ProductSupply
 * @extends C.ui.Module
 */
C.define('O.ui.module.ProductSupply', {
	extend: 'C.ui.Module',

/**
	* Alias string for this module
	* @important "alias" is needed by Ext.ClassManager to find module class
	* @type String
	*/
	alias: 'module-productsupply',

/**
	* Module identifier
	* Is used for storing and searching the module by its name
	* @type String
	*/
	id: 'productsupply',

	/**
	* Weight of module in ui list.
	* @type Number
	*/
	weight: 100,

/**
	* xtype of a panel (for modules with 'config' or 'module' type)
	* @type String
	*/
	panel: 'act_productsupply',

/**
	* Short module name (for buttons, etc.)
	* @type String
	*/
	textShort: 'Product supply',

/**
	* Short description of module (for tooltips, etc.)
	* @type String
	*/
	textLong: 'List of product supplies'

});