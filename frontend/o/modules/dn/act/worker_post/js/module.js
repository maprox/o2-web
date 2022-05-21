/**
 *
 * Posts editor
 * @class O.mon.act.worker_post.Module
 * @extends C.ui.Module
 */
C.define('O.dn.act.worker_post.Module', {
	extend: 'C.ui.Module',

/**
	* Alias string for this module
	* @important "alias" is needed by Ext.ClassManager to find module class
	* @type String
	*/
	alias: 'module-dn-worker-post',

/**
	* Module identifier
	* Is used for storing and searching the module by its name
	* @type String
	*/
	id: 'dn-worker-post',

/**
	* Module type
	*/
	type: 'module',

/**
	* Module weight
	*/
	weight: 53,

/**
	* xtype of a panel (for modules with 'config' or 'module' type)
	* @type String
	*/
	panel: 'dn-worker-post',

/**
	* Short module name (for buttons, etc.)
	* @type String
	*/
	textShort: _('Posts'),

/**
	* Short description of module (for tooltips, etc.)
	* @type String
	*/
	textLong: _('Posts editor')

});