/**
 *
 * Catering facilities panel
 * @class O.ui.module.CateringFacilities
 * @extends C.ui.Module
 */
C.define('O.ui.module.CateringFacilities', {
	extend: 'C.ui.Module',

/**
	* Alias string for this module
	* @important "alias" is needed by Ext.ClassManager to find module class
	* @type String
	*/
	alias: 'module-cateringfacilities',

/**
	* Module identifier
	* Is used for storing and searching the module by its name
	* @type String
	*/
	id: 'cateringfacilities',

	/**
	* Weight of module in ui list.
	* @type Number
	*/
	weight: 100,

/**
	* xtype of a panel (for modules with 'config' or 'module' type)
	* @type String
	*/
	panel: 'act_cateringfacilities',

/**
	* Short module name (for buttons, etc.)
	* @type String
	*/
	textShort: 'Catering facilities',

/**
	* Short description of module (for tooltips, etc.)
	* @type String
	*/
	textLong: 'List of catering facilities'

});