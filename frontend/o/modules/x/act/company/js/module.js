/**
 *
 * Company editor
 * @class O.x.act.company.Module
 * @extends C.ui.Module
 */
C.define('O.x.act.company.Module', {
	extend: 'C.ui.Module',

/**
	* Alias string for this module
	* @important "alias" is needed by Ext.ClassManager to find module class
	* @type String
	*/
	alias: 'module-x-company',

/**
	* Module identifier
	* Is used for storing and searching the module by its name
	* @type String
	*/
	id: 'x-company',

/**
	* Module type
	*/
	type: 'module',

/**
	* Module weight
	*/
	weight: 60,

/**
	* xtype of a panel (for modules with 'config' or 'module' type)
	* @type String
	*/
	panel: 'x-company',

/**
	* Short module name (for buttons, etc.)
	* @type String
	*/
	textShort: _('Counterparty'),

/**
	* Short description of module (for tooltips, etc.)
	* @type String
	*/
	textLong: _('Counterparty')

});