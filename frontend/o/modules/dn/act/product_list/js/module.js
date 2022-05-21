/**
 *
 * Product list panel
 * @class O.ui.module.ProductList
 * @extends C.ui.Module
 */
C.define('O.ui.module.ProductList', {
	extend: 'C.ui.Module',

/**
	* Alias string for this module
	* @important "alias" is needed by Ext.ClassManager to find module class
	* @type String
	*/
	alias: 'module-productlist',

/**
	* Module identifier
	* Is used for storing and searching the module by its name
	* @type String
	*/
	id: 'productlist',

	/**
	* Weight of module in ui list.
	* @type Number
	*/
	weight: 100,

/**
	* xtype of a panel (for modules with 'config' or 'module' type)
	* @type String
	*/
	panel: 'act_productlist',

/**
	* Short module name (for buttons, etc.)
	* @type String
	*/
	textShort: 'Products',

/**
	* Short description of module (for tooltips, etc.)
	* @type String
	*/
	textLong: 'List of products'

});