/**
 *
 * Product norm panel
 * @class O.ui.module.ProductNorm
 * @extends C.ui.Module
 */
C.define('O.ui.module.ProductNorm', {
	extend: 'C.ui.Module',

/**
	* Alias string for this module
	* @important "alias" is needed by Ext.ClassManager to find module class
	* @type String
	*/
	alias: 'module-productnorm',

/**
	* Module identifier
	* Is used for storing and searching the module by its name
	* @type String
	*/
	id: 'productnorm',

	/**
	* Weight of module in ui list.
	* @type Number
	*/
	weight: 100,

/**
	* xtype of a panel (for modules with 'config' or 'module' type)
	* @type String
	*/
	panel: 'act_productnorm',

/**
	* Short module name (for buttons, etc.)
	* @type String
	*/
	textShort: 'Product norms',

/**
	* Short description of module (for tooltips, etc.)
	* @type String
	*/
	textLong: 'List of product norms'

});