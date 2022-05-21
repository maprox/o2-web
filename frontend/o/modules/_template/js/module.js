/**
 * @fileOverview Template module
 *
 * @class O.sdesk.act.issues.Module
 * @extends C.ui.Module
 */
C.define('O.sdesk.act.issues.Module', {
	extend: 'C.ui.Module',

/**
	* Alias string for this module
	* @important "alias" is needed by Ext.ClassManager to find module class
	* @type String
	*/
	alias: 'module-sdesk-issues',

/**
	* Module identifier
	* Is used for storing and searching the module by its name
	* @type String
	*/
	id: 'sdesk-issues',

/**
	* Weight of module in ui list.
	* @type Number
	*/
	weight: 10,

/**
	* xtype of a panel (for modules with 'config' or 'module' type)
	* @type String
	*/
	panel: 'sdesk-issues',

/**
	* Short module name (for buttons, etc.)
	* @type String
	*/
	textShort: 'Service desk',

/**
	* Short description of module (for tooltips, etc.)
	* @type String
	*/
	textLong: 'A list of service desk issues'

});