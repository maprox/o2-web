/**
 * @fileOverview Device monitoring map module
 *
 * @class O.ui.module.Map
 * @extends C.ui.Module
 */
C.define('O.ui.module.TrackHistory', {
	extend: 'C.ui.Module',

/**
	* Alias string for this module
	* @important "alias" is needed by Ext.ClassManager to find module class
	* @type String
	*/
	alias: 'module-trackhistory',

/**
	* Module identifier
	* Is used for storing and searching the module by its name
	* @type String
	*/
	id: 'trackhistory',

/**
	* Weight of module in ui list.
	* @type Number
	*/
	weight: 10,

/**
	* xtype of a panel (for modules with 'config' or 'module' type)
	* @type String
	*/
	panel: 'act_trackhistory',

/**
	* Short module name (for buttons, etc.)
	* @type String
	*/
	textShort: 'Track history',

/**
	* Short description of module (for tooltips, etc.)
	* @type String
	*/
	textLong: 'Track history'

});