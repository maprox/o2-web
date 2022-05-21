/**
 * Access editor module
 * @class O.common.act.access.Module
 * @extends C.ui.Module
 */
C.define('O.common.act.access.Module', {
	extend: 'C.ui.Module',

/**
	* Alias string for this module
	* @important "alias" is needed by Ext.ClassManager to find module class
	* @cfg {String}
	*/
	alias: 'common-access',

/**
	* Module identifier
	* Is used for storing and searching the module by its name
	* @cfg {String}
	*/
	id: 'access',

	/**
	* Weight of module in ui list.
	* @cfg {Number}
	*/
	weight: 50,

/**
	* xtype of a panel (for modules with 'config' or 'module' type)
	* @cfg {String}
	*/
	panel: 'common_access',

/**
	* Short module name (for buttons, etc.)
	* @cfg {String}
	*/
	textShort: 'Access',

/**
	* Short description of module (for tooltips, etc.)
	* @cfg {String}
	*/
	textLong: 'Access levels and rights editor'

});
