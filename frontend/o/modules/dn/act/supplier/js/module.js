/**
 *
 * Suppliers list panel
 * @class O.ui.module.dn.Supplier
 * @extends C.ui.Module
 */
C.define('O.ui.module.dn.Supplier', {
	extend: 'C.ui.Module',

/**
	* Alias string for this module
	* @important "alias" is needed by Ext.ClassManager to find module class
	* @type String
	*/
	alias: 'module-dn-supplier',

/**
	* Module identifier
	* Is used for storing and searching the module by its name
	* @type String
	*/
	id: 'dn_supplier',

	/**
	* Weight of module in ui list.
	* @type Number
	*/
	weight: 1000,

/**
	* xtype of a panel (for modules with 'config' or 'module' type)
	* @type String
	*/
	panel: 'act_dn_supplier',

/**
	* Short module name (for buttons, etc.)
	* @type String
	*/
	textShort: 'Suppliers',

/**
	* Short description of module (for tooltips, etc.)
	* @type String
	*/
	textLong: 'List of firm suppliers'

});