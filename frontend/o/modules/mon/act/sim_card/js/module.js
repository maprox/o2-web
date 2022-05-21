/**
 * Sim card editor
 * @class O.mon.act.sim_card.Module
 * @extends C.ui.Module
 */
C.define('O.mon.act.sim_card.Module', {
	extend: 'C.ui.Module',

/**
	* Alias string for this module
	* @important "alias" is needed by Ext.ClassManager to find module class
	* @type String
	*/
	alias: 'module-mon-sim-card',

/**
	* Module identifier
	* Is used for storing and searching the module by its name
	* @type String
	*/
	id: 'mon-sim-card',

/**
	* Module type
	*/
	type: 'module',

/**
	* Module weight
	*/
	weight: 4,

/**
	* xtype of a panel (for modules with 'config' or 'module' type)
	* @type String
	*/
	panel: 'mon-sim-card',

/**
	* Short module name (for buttons, etc.)
	* @type String
	*/
	textShort: _('Sim cards'),

/**
	* Short description of module (for tooltips, etc.)
	* @type String
	*/
	textLong: _('Sim cards editor')

});