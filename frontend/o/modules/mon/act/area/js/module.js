/**
 * Area list module
 * @class O.mon.act.area.Module
 * @extends C.ui.Module
 */
C.define('O.mon.act.area.Module', {
	extend: 'C.ui.Module',

/**
	* Alias string for this module
	* @important "alias" is needed by Ext.ClassManager to find module class
	* @type String
	*/
	alias: 'module-mon-area',

/**
	* Module identifier
	* Is used for storing and searching the module by its name
	* @type String
	*/
	id: 'mon-area',
	
/**
	* Module type
	*/
	type: 'module',

/**
	* Module weight
	*/
	weight: 95,

/**
	* xtype of a panel (for modules with 'config' or 'module' type)
	* @type String
	*/
	panel: 'mon-geofence',

/**
	* Short module name (for buttons, etc.)
	* @type String
	*/
	textShort: _('Area'),

/**
	* Short description of module (for tooltips, etc.)
	* @type String
	*/
	textLong: _('List of areas')

});