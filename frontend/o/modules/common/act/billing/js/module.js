/**
 *
 * Billing panel
 * @class O.ui.module.Billing
 * @extends C.ui.Module
 */
C.define('O.ui.module.Billing', {
	extend: 'C.ui.Module',

/**
	* Alias string for this module
	* @important "alias" is needed by Ext.ClassManager to find module class
	* @type String
	*/
	alias: 'module-billing',

/**
	* Module identifier
	* Is used for storing and searching the module by its name
	* @type String
	*/
	id: 'billing',
	
/**
	* Module type
	*/
	type: 'module',

/**
	* Module weight
	*/
	weight: 10000,

/**
	* xtype of a panel (for modules with 'config' or 'module' type)
	* @type String
	*/
	panel: 'common-billing',

/**
	* Short module name (for buttons, etc.)
	* @type String
	*/
	textShort: 'Billing',

/**
	* Short description of module (for tooltips, etc.)
	* @type String
	*/
	textLong: 'Billing'

});