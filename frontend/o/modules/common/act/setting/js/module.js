/**
 * @fileOverview User settings module
 *
 * User settings module
 * @class O.ui.module.Settings
 * @extends C.ui.Module
 */
C.define('O.ui.module.Settings', {
	extend: 'C.ui.Module',

/**
	* Alias string for this module
	* @important "alias" is needed by Ext.ClassManager to find module class
	* @type String
	*/
	alias: 'module-settings',

/**
	* Module identifier
	* Is used for storing and searching the module by its name
	* @type String
	*/
	id: 'settings',

/**
	* Module type
	*/
	type: 'module',

/**
	* Module weight
	*/
	weight: 10001,

/**
	* xtype of a panel (for modules with 'config' or 'module' type)
	* @type String
	*/
	panel: 'act_admin_settings',

/**
	* Short module name (for buttons, etc.)
	* @type String
	*/
	textShort: 'Settings',

/**
	* Short description of module (for tooltips, etc.)
	* @type String
	*/
	textLong: 'User settings',

/**
	* Initialization of module.
	* Adding link to a link container
	*/
	init: function() {
		this.callParent(arguments);

		/*var searchResult = Ext.ComponentQuery.query('link-container');
		if (searchResult.length) {
			searchResult[0].addLink({
				title: this.textShort,
				alt: this.textLong,
				cls: this.id,
				handler: Ext.bind(this.callSettings, this)
			});
		}*/
	},

	/**
	 * Settings link click
	 */
	callSettings: function() {
		O.ui.Desktop.callModule('settings', [{name: 'user'}]);
	}

});
