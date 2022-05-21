/**
 * @fileOverview Service desk issues list module
 *
 * @class O.mon.act.waylist.Module
 * @extends C.ui.Module
 */
C.define('O.mon.act.waylist.Module', {
	extend: 'C.ui.Module',

/**
	* Alias string for this module
	* @important "alias" is needed by Ext.ClassManager to find module class
	* @type String
	*/
	alias: 'module-mon_waylist',

/**
	* Module identifier
	* Is used for storing and searching the module by its name
	* @type String
	*/
	id: 'mon_waylist',

/**
	* Weight of module in ui list.
	* @type Number
	*/
	weight: 10,

/**
	* xtype of a panel (for modules with 'config' or 'module' type)
	* @type String
	*/
	panel: 'mon-waylist-panel',

/**
	* Short module name (for buttons, etc.)
	* @type String
	*/
	textShort: _('Waylist'),

/**
	* Short description of module (for tooltips, etc.)
	* @type String
	*/
	textLong: _('A list of waylists')
});