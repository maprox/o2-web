/**
 *
 * Reports panel
 * @class O.common.act.reports.Module
 * @extends C.ui.Module
 */
C.define('O.common.act.reports.Module', {
	extend: 'C.ui.Module',

/**
	* Alias string for this module
	* @important "alias" is needed by Ext.ClassManager to find module class
	* @type String
	*/
	alias: 'module-reports',

/**
	* Module identifier
	* Is used for storing and searching the module by its name
	* @type String
	*/
	id: 'reports',

/**
	* Weight of module in ui list.
	* @type Number
	*/
	weight: 250,

/**
	* xtype of a panel (for modules with 'config' or 'module' type)
	* @type String
	*/
	panel: 'reports',

/**
	* Short module name (for buttons, etc.)
	* @type String
	*/
	textShort: 'Reports',

/**
	* Short description of module (for tooltips, etc.)
	* @type String
	*/
	textLong: 'Reports'

});