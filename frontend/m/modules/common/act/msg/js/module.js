/**
 *
 * System msg panel
 * @class M.act.msg.Module
 * @extends C.ui.Module
 */
Ext.define('M.act.msg.Module', {
	extend: 'C.ui.Module',

/**
	* Alias string for this module
	* @important "alias" is needed by Ext.ClassManager to find module class
	* @type String
	*/
	alias: 'module-msg',

/**
	* Module identifier
	* Is used for storing and searching the module by its name
	* @type String
	*/
	id: 'msg',

	/**
	* Weight of module in ui list.
	* @type Number
	*/
	weight: 110,

/**
	* xtype of a panel (for modules with 'config' or 'module' type)
	* @type String
	*/
	panel: 'act_msg',

/**
	* Controller name (for sencha touch / new sencha MVC system)
	* It will search for the class named O.app.controller.[controller]
	* @type String
	*/
	controller: 'Msg',

/**
	* iconCls of a tab (if null, here will be module identifier)
	* @type String
	*/
	iconCls: 'chat1',

/**
	* Short module name (for buttons, etc.)
	* @type String
	*/
	textShort: 'Messages',

/**
	* Short description of module (for tooltips, etc.)
	* @type String
	*/
	textLong: 'List of system messages'

});