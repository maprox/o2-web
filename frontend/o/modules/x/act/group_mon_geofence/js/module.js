/**
 *
 * Geofence groups editor
 * @class O.x.act.group_mon_geofence.Module
 * @extends C.ui.Module
 */
Ext.define('O.x.act.group_mon_geofence.Module', {
	extend: 'C.ui.Module',

/**
	* Alias string for this module
	* @important "alias" is needed by Ext.ClassManager to find module class
	* @type String
	*/
	alias: 'module-x-group-mon-geofence',

/**
	* Module identifier
	* Is used for storing and searching the module by its name
	* @type String
	*/
	id: 'x-group-mon-geofence',

/**
	* Module type
	*/
	type: 'module',

/**
	* Module weight
	*/
	weight: 96,

/**
	* xtype of a panel (for modules with 'config' or 'module' type)
	* @type String
	*/
	panel: 'x-group-mon-geofence',

/**
	* Short module name (for buttons, etc.)
	* @type String
	*/
	textShort: _('Geofence groups'),

/**
	* Short description of module (for tooltips, etc.)
	* @type String
	*/
	textLong: _('Geofence groups')

});