/**
 * Application desktop class
 *
 * @class O.app.controller.Desktop
 * @extend Ext.app.Controller
 */
Ext.define('O.app.controller.Desktop', {
	extend: 'Ext.app.Controller',

	config: {
		refs: {
			desktop: '#desktop'
		},
		control: {
			desktop: {
				painted: 'onDesktopPainted'
			}
		}
	},
	id: 'desktop',

/**
	* Modules has been loaded flag
	*/
	modulesLoaded: false,

/**
	* Returns an items configuration array
	* @return Array
	* @private
	*/
	loadModules: function() {
		var desktop = this.getDesktop();
		if (!desktop) { return null; }
		var app = this.getApplication();
		var instances = app.getControllerInstances();
		// load modules
		var index = 0;
		var modules = O.ui.Desktop.getModulesByType('module');
		Ext.each(modules, function(module, index) {
			if (!module || !module.controller) { return; }
			var controllerName = 'O.app.controller.' + module.controller;
			var controllerInstance = Ext.create(controllerName, {
				application: app
			});
			var panel = desktop.add({
				xtype: module.panel,
				setBadgeText: function(value) {
					var tabs = Ext.ComponentQuery.query('#desktop tab');
					var item = tabs[index];
					if (item) {
						item.setBadgeText(value);
					}
				},
				getBadgeText: function() {
					var tabs = Ext.ComponentQuery.query('#desktop tab');
					var item = tabs[index];
					if (item) {
						return item.getBadgeText();
					}
					return null;
				}
			});
			instances[controllerName] = controllerInstance;
			if (controllerInstance.init) {
				// controller initialization
				controllerInstance.init();
			}
			if (controllerInstance.launch) {
				// controller launch
				controllerInstance.launch();
			}
		}, this);
		app.setControllerInstances(instances);

		// Set modules loaded flag
		this.modulesLoaded = true;
	},

/**
	* After desktop is painted, we need to
	* dynamically load modules
	* @private
	*/
	onDesktopPainted: function() {
		// load modules if they wasn't loaded yet
		if (!this.modulesLoaded) {
			this.loadModules();
			M.ui.desktop.State.init(this);
		}
	}
});
