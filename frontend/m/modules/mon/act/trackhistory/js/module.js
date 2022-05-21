/**
 * @copyright  2012, Maprox LLC
 */
/**
 * Device track history module
 * @class M.act.trackhistory.Module
 * @extends C.ui.Module
 */
Ext.define('M.act.trackhistory.Module', {
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
	* Controller name (for sencha touch / new sencha MVC system)
	* It will search for the class named O.app.controller.[controller]
	* @type String
	*/
	controller: 'TrackHistory',

/**
	* iconCls of a tab (if null, here will be module identifier)
	* @type String
	*/
	iconCls: 'maps',

/**
	* Short module name (for buttons, etc.)
	* @type String
	*/
	textShort: 'Tracks',

/**
	* Short description of module (for tooltips, etc.)
	* @type String
	*/
	textLong: 'Track history'

});
