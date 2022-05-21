/**
 *
 * Prices Responses panel of an application
 * @class O.ui.module.PricesResponse
 * @extends C.ui.Module
 */
C.define('O.ui.module.PricesResponses', {
	extend: 'C.ui.Module',

/**
	* Alias string for this module
	* @important "alias" is needed by Ext.ClassManager to find module class
	* @type String
	*/
	alias: 'module-pricesresponse',

/**
	* Module identifier
	* Is used for storing and searching the module by its name
	* @type String
	*/
	id: 'pricesresponse',

/**
	* xtype of a panel (for modules with 'config' or 'module' type)
	* @type String
	*/
	panel: 'act_pricesresponse',

/**
	* Module weight
	*/
	weight: 110,

/**
	* Short module name (for buttons, etc.)
	* @type String
	*/
	textShort: 'Prices Responses',

/**
	* Short description of module (for tooltips, etc.)
	* @type String
	*/
	textLong: 'Prices Responses',

/**
	* Initialization handler
	*/
	init: function() {
		this.callParent(arguments);
	}

});
