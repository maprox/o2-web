/**
 * Reports module
 *
 * @class M.act.reports.Module
 * @extends C.ui.Module
 */
Ext.define('M.act.reports.Module', {
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
	panel: 'act_reports',

/**
	* Controller name (for sencha touch / new sencha MVC system)
	* It will search for the class named O.app.controller.[controller]
	* @type String
	*/
	controller: 'Reports',

/**
	* iconCls of a tab (if null, here will be module identifier)
	* @type String
	*/
	iconCls: 'chart2',

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