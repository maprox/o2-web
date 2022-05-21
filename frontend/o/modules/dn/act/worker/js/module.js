/**
 * @fileOverview Firm workers module
 *
 * @class O.dn.act.workers.Module
 * @extends C.ui.Module
 */
C.define('O.dn.act.workers.Module', {
	extend: 'C.ui.Module',

/**
	* Alias string for this module
	* @important "alias" is needed by Ext.ClassManager to find module class
	* @type String
	*/
	alias: 'module-dn-workers',

/**
	* Module identifier
	* Is used for storing and searching the module by its name
	* @type String
	*/
	id: 'dn-workers',

/**
	* Weight of module in ui list.
	* @type Number
	*/
	weight: 55,

/**
	* xtype of a panel (for modules with 'config' or 'module' type)
	* @type String
	*/
	panel: 'dn-workers',

/**
	* Short module name (for buttons, etc.)
	* @type String
	*/
	textShort: _('Workers'),

/**
	* Short description of module (for tooltips, etc.)
	* @type String
	*/
	textLong: _('A list of firm workers')

});