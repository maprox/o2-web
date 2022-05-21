/**
 * @fileOverview Device monitoring map module
 *
 * @class O.ui.module.Map
 * @extends C.ui.Module
 */
C.define('O.ui.module.Map', {
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