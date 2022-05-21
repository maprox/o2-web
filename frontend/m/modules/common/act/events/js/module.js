/**
 */
/** System events panel
 * @class M.act.events.Module
 * @extends C.ui.Module
 */
Ext.define('M.act.events.Module', {
	extend: 'C.ui.Module',

/**
	* Alias string for this module
	* @important "alias" is needed by Ext.ClassManager to find module class
	* @type String
	*/
	alias: 'module-events',

/**
	* Module identifier
	* Is used for storing and searching the module by its name
	* @type String
	*/
	id: 'events',

	/**
	* Weight of module in ui list.
	* @type Number
	*/
	weight: 100,

/**
	* xtype of a panel (for modules with 'config' or 'module' type)
	* @type String
	*/
	panel: 'act_events',

/**
	* Controller name (for sencha touch / new sencha MVC system)
	* It will search for the class named O.app.controller.[controller]
	* @type String
	*/
	controller: 'Events',

/**
	* iconCls of a tab (if null, here will be module identifier)
	* @type String
	*/
	iconCls: 'note_black',

/**
	* Short module name (for buttons, etc.)
	* @type String
	*/
	textShort: 'Events',

/**
	* Short description of module (for tooltips, etc.)
	* @type String
	*/
	textLong: 'List of system events'

});
