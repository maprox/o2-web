/**
 *
 * Device editor
 * @class O.mon.act.device.Module
 * @extends C.ui.Module
 */
Ext.define('O.mon.act.device.Module', {
	extend: 'C.ui.Module',

/**
	* Alias string for this module
	* @important "alias" is needed by Ext.ClassManager to find module class
	* @type String
	*/
	alias: 'module-mon-device',

/**
	* Module identifier
	* Is used for storing and searching the module by its name
	* @type String
	*/
	id: 'mon-device',

/**
	* Module type
	*/
	type: 'module',

/**
	* Module weight
	*/
	weight: 5,

/**
	* xtype of a panel (for modules with 'config' or 'module' type)
	* @type String
	*/
	panel: 'mon-device',

/**
	* Short module name (for buttons, etc.)
	* @type String
	*/
	textShort: _('Devices'),

/**
	* Short description of module (for tooltips, etc.)
	* @type String
	*/
	textLong: _('Devices editor')

});