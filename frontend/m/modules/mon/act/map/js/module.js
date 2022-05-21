/**
 * @class M.act.map.Module
 * @extends C.ui.Module
 */
Ext.define('M.act.map.Module', {
	extend: 'C.ui.Module',

/**
	* Alias string for this module
	* @important "alias" is needed by Ext.ClassManager to find module class
	* @type String
	*/
	alias: 'module-map',

/**
	* Module identifier
	* Is used for storing and searching the module by its name
	* @type String
	*/
	id: 'map',

/**
	* Weight of module in ui list.
	* @type Number
	*/
	weight: 5,

/**
	* xtype of a panel (for modules with 'config' or 'module' type)
	* @type String
	*/
	panel: 'act_map',

/**
	* Controller name (for sencha touch / new sencha MVC system)
	* It will search for the class named O.app.controller.[controller]
	* @type String
	*/
	controller: 'Map',

/**
	* iconCls of a tab (if null, here will be module identifier)
	* @type String
	*/
	iconCls: 'globe_black',

/**
	* Short module name (for buttons, etc.)
	* @type String
	*/
	textShort: 'Map',

/**
	* Short description of module (for tooltips, etc.)
	* @type String
	*/
	textLong: 'Transport monitoring map'

});
