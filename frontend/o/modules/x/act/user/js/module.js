/**
 *
 * System events panel
 * @class O.ui.module.UsersEditor
 * @extends C.ui.Module
 */
C.define('O.ui.module.UsersEditor', {
	extend: 'C.ui.Module',

/**
	* Alias string for this module
	* @important "alias" is needed by Ext.ClassManager to find module class
	* @type String
	*/
	alias: 'module-userseditor',

/**
	* Module identifier
	* Is used for storing and searching the module by its name
	* @type String
	*/
	id: 'userseditor',
	
/**
	* Module type
	*/
	type: 'module',

/**
	* Module weight
	*/
	weight: 40,

/**
	* xtype of a panel (for modules with 'config' or 'module' type)
	* @type String
	*/
	panel: 'comp_admin_userseditor',

/**
	* Short module name (for buttons, etc.)
	* @type String
	*/
	textShort: 'Users',

/**
	* Short description of module (for tooltips, etc.)
	* @type String
	*/
	textLong: 'Users Editor'

});