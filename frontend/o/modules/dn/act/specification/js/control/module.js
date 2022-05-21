/**
 *
 * Specification panel
 * @class O.ui.module.dn.Specification
 * @extends C.ui.Module
 */
C.define('O.ui.module.dn.Specification', {
	extend: 'C.ui.Module',

/**
	* Alias string for this module
	* @important "alias" is needed by Ext.ClassManager to find module class
	* @type String
	*/
	alias: 'module-dn-specification',

/**
	* Module identifier
	* Is used for storing and searching the module by its name
	* @type String
	*/
	id: 'dn_specification',
	
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
	panel: 'act_dn_specification',

/**
	* Short module name (for buttons, etc.)
	* @type String
	*/
	textShort: 'Specifications',

/**
	* Short description of module (for tooltips, etc.)
	* @type String
	*/
	textLong: 'Specifications list'

});