/**
 *
 * System events panel
 * @class O.ui.module.FirmsEditor
 * @extends C.ui.Module
 */
C.define('O.ui.module.FirmsEditor', {
	extend: 'C.ui.Module',

/**
	* Alias string for this module
	* @important "alias" is needed by Ext.ClassManager to find module class
	* @type String
	*/
	alias: 'module-firmseditor',

/**
	* Module identifier
	* Is used for storing and searching the module by its name
	* @type String
	*/
	id: 'firmseditor',

/**
	* Module type
	*/
	type: 'module',

/**
	* Module weight
	*/
	weight: 220,

/**
	* xtype of a panel (for modules with 'config' or 'module' type)
	* @type String
	*/
	panel: 'act_firmseditor',

/**
	* Short module name (for buttons, etc.)
	* @type String
	*/
	textShort: 'Firms',

/**
	* Short description of module (for tooltips, etc.)
	* @type String
	*/
	textLong: 'Firms Editor'

});
