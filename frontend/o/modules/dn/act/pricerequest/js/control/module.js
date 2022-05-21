/**
 *
 * Prices requests panel of an application
 * @class O.ui.module.PricesRequest
 * @extends C.ui.Module
 */
C.define('O.ui.module.PricesRequests', {
	extend: 'C.ui.Module',

/**
	* Alias string for this module
	* @important "alias" is needed by Ext.ClassManager to find module class
	* @type String
	*/
	alias: 'module-pricesrequest',

/**
	* Module identifier
	* Is used for storing and searching the module by its name
	* @type String
	*/
	id: 'pricesrequest',

/**
	* xtype of a panel (for modules with 'config' or 'module' type)
	* @type String
	*/
	panel: 'act_pricesrequest',

/**
	* Module weight
	*/
	weight: 100,

/**
	* Short module name (for buttons, etc.)
	* @type String
	*/
	textShort: 'Tenders',

/**
	* Short description of module (for tooltips, etc.)
	* @type String
	*/
	textLong: 'Tenders',

/**
	* Initialization handler
	*/
	init: function() {
		this.callParent(arguments);
	}

});
