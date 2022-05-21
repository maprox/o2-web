/**
 *
 * Supplier personal cabinet
 * @class O.ui.module.dn.Cabinet
 * @extends C.ui.Module
 */
C.define('O.ui.module.dn.Cabinet', {
	extend: 'C.ui.Module',

/**
	* Alias string for this module
	* @important "alias" is needed by Ext.ClassManager to find module class
	* @type String
	*/
	alias: 'module-dn-cabinet',

/**
	* Module identifier
	* Is used for storing and searching the module by its name
	* @type String
	*/
	id: 'dn_cabinet',
	
/**
	* Module type
	*/
	type: 'module',

/**
	* Module weight
	*/
	weight: 1,

/**
	* xtype of a panel (for modules with 'config' or 'module' type)
	* @type String
	*/
	panel: 'act_dn_cabinet',

/**
	* Short module name (for buttons, etc.)
	* @type String
	*/
	textShort: 'Cabinet',

/**
	* Short description of module (for tooltips, etc.)
	* @type String
	*/
	textLong: 'Supplier personal cabinet'

});