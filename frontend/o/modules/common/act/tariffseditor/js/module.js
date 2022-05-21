/**
 *
 * Packages editor
 * @class O.common.act.tariff.Module
 * @extends O.ui.Module
 */
C.define('O.common.act.tariff.Module', {
	extend: 'C.ui.Module',

/**
	* Alias string for this module
	* @important "alias" is needed by Ext.ClassManager to find module class
	* @type String
	*/
	alias: 'module-tariffseditor',

/**
	* Module identifier
	* Is used for storing and searching the module by its name
	* @type String
	*/
	id: 'tariffseditor',

/**
	* Module type
	*/
	type: 'module',

/**
	* Module weight
	*/
	weight: 61,

/**
	* xtype of a panel (for modules with 'config' or 'module' type)
	* @type String
	*/
	panel: 'act_admin_tariffseditor',

/**
	* Short module name (for buttons, etc.)
	* @type String
	*/
	textShort: 'Tariff',

/**
	* Short description of module (for tooltips, etc.)
	* @type String
	*/
	textLong: 'Tariffs editor'

});
