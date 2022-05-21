/**
 * Catering manager analytics module
 * @class O.dn.act.analytics.Module
 * @extends C.ui.Module
 */
C.define('O.dn.act.analytics.Module', {
	extend: 'C.ui.Module',

/**
	* Alias string for this module
	* @important "alias" is needed by Ext.ClassManager to find module class
	* @type String
	*/
	alias: 'module-dn-analytics',

/**
	* Module identifier
	* Is used for storing and searching the module by its name
	* @type String
	*/
	id: 'dn-analytics',

/**
	* Weight of module in ui list.
	* @type Number
	*/
	weight: 110,

/**
	* xtype of a panel (for modules with 'config' or 'module' type)
	* @type String
	*/
	panel: 'dn-analytics',

/**
	* Short module name (for buttons, etc.)
	* @type String
	*/
	textShort: 'Analytics',

/**
	* Short description of module (for tooltips, etc.)
	* @type String
	*/
	textLong: 'View of analytical reports'

});