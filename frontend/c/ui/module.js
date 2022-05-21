/**
 */
/**
 * Abstract class of ui module
 * @class C.ui.Module
 * @extends Ext.util.Observable
 */
Ext.define('C.ui.Module', {
	extend: 'Ext.util.Observable',

/**
	* Module identifier
	* Is used for storing and searching the module by its name
	* @type String
	*/
	id: null,

/**
	* Type of module
	* Available types: 'module' (default), 'config', 'link'
	* <b>module</b> - Application module, which appears on the desktop
	* as a single button (for example, act_map or act_events)
	* <b>config</b> - Application module that appears in the admin panel
	* <b>link</b> - Application module, which appears in the
	* link bar of application (for quick access)
	* @type String
	*/
	type: 'module',

/**
	* Weight of module in ui list.
	* @type Number
	*/
	weight: 0,

/**
	* xtype of a panel (for modules with 'config' or 'module' type)
	* @type String
	*/
	panel: null,

/**
	* iconCls of a tab (if null, here will be module identifier)
	* @type String
	*/
	iconCls: null,

/**
	* Short module name (for buttons, etc.)
	* @type String
	*/
	textShort: null,

/**
	* Short description of module (for tooltips, etc.)
	* @type String
	*/
	textLong: null,

/**
	* Long description (documentation)
	* @type String
	*/
	description: null,

/**
	* Initialization function
	*/
	init: Ext.emptyFn,

/**
	* Search for a global panel by its alias
	* @param {String} name Alias of a panel
	* @return {Ext.Component}
	* @private
	*/
	findComponent: function(name) {
		var searchResult = Ext.ComponentQuery.query(name);
		if (searchResult.length > 0) {
			return searchResult[0];
		}
		return null;
	},

/**
	* Module handler
	* @param {Object[]} params An array of module params {name: '', value: ''}
	*/
	activate: function(params) {
		if (C.isMobile()) {
			if (this.controller) {
				var c = O.app.getController(this.controller);
				if (c && c.activate) {
					// switch tab in global tabpanel
					var panel = this.findComponent(this.panel);
					if (panel) {
						var desktop = this.findComponent('#desktop');
						if (desktop) {
							desktop.setActiveItem(panel);
						}
					}
					// activating controller
					c.activate(params);
				} else {
					console.warn('Controller "' + this.controller +
						'" specified for module "' + this.$className +
						'" not found, or there is no method "activate" ' +
						'in the specified controller!');
				}
			} else {
				console.warn('No controller specified for module "' +
					this.$className + '"');
			}
		} else {
			if (this.type !== 'link') {
				var panel = this.findComponent(this.panel);
				if (!panel) {
					var desktop = this.findComponent('#desktop');
					if (desktop) {
						panel = desktop.addModule(this);
					}
				}
				if (panel && panel.moduleActivate) {
					panel.moduleActivate(params);
				}
			}
		}
	}
});
