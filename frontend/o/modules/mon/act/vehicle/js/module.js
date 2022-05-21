/**
 *
 * Vehicle editor
 * @class O.mon.act.vehicle.Module
 * @extends C.ui.Module
 */
C.define('O.mon.act.vehicle.Module', {
	extend: 'C.ui.Module',

/**
	* Alias string for this module
	* @important "alias" is needed by Ext.ClassManager to find module class
	* @type String
	*/
	alias: 'module-mon-vehicle',

/**
	* Module identifier
	* Is used for storing and searching the module by its name
	* @type String
	*/
	id: 'mon-vehicle',

/**
	* Module type
	*/
	type: 'module',

/**
	* Module weight
	*/
	weight: 50,

/**
	* xtype of a panel (for modules with 'config' or 'module' type)
	* @type String
	*/
	panel: 'mon-vehicle',

/**
	* Short module name (for buttons, etc.)
	* @type String
	*/
	textShort: _('Vehicles'),

/**
	* Short description of module (for tooltips, etc.)
	* @type String
	*/
	textLong: _('Vehicles editor')

});