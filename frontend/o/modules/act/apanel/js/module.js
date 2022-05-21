/**
 * @fileOverview Administration module
 *
 * @class O.ui.module.Apanel
 * @extends C.ui.Module
 */
C.define('O.ui.module.Apanel', {
	extend: 'C.ui.Module',

/**
	* Alias string for this module
	* @important "alias" is needed by Ext.ClassManager to find module class
	* @type String
	*/
	alias: 'module-apanel',

/**
	* Module type
	*/
	type: 'link',

/**
	* Module identifier
	* Is used for storing and searching the module by its name
	* @type String
	*/
	id: 'apanel',

/**
	* Short module name (for buttons, etc.)
	* @type String
	*/
	textShort: 'Administration panel',

/**
	* Short description of module (for tooltips, etc.)
	* @type String
	*/
	textLong: 'Administration panel',

/**
	* Initialization of module.
	* Adding link to a link container
	*/
	init: function() {
		this.callParent(arguments);
		var searchResult = Ext.ComponentQuery.query('link-container');
		if (searchResult.length) {
			searchResult[0].addLink(this);
		}
	},

/**
	* Module handler
	* @param {Object[]} params An array of module params {name: '', value: ''}
	*/
	activate: function(params) {
		window.open('/admin');
	}
});