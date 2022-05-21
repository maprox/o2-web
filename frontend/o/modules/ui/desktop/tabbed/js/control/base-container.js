/**
 * @class O.layout.TabContainer
 */
C.utils.inherit('O.layout.TabContainer', {
/**
	* Desktop initialization
	* @constructs
	*/
	initComponent: function() {
		this.callParent(arguments);
		console.debug('init modules');

		var modules = O.ui.Desktop.getModulesByType('module');
		if (!modules.length) {
			console.debug('No modules found!');
			return;
		}
		var firstModule = modules[0];

		console.debug('First module', firstModule.id);

		var moduleName = null;
		var parsed = O.manager.History.parseToken(
			O.manager.History.getCurrentToken());

		if (parsed.length > 0) {
			moduleName = parsed[0].name;
		}

		console.debug('Module name', moduleName);

		var moduleAdded = false;

		if (moduleName) {
			for (var i = 0; i < modules.length; i++) {
				var module = modules[i];
				if (module.id == moduleName) {
					this.addModule(module);
					moduleAdded = true;
					break;
				}
			}
		}

		if (!moduleAdded) {
			this.addModule(firstModule);
		}
	},

/**
	 * Adds module
	 * @param module
	 */
	addModule: function(module) {
		if (!module || !module.panel) {
			return null;
		}
		var panel = this.add({xtype: module.panel});
		console.debug('done: ' + module.id);
		if (!this.getActiveTab() && !this.waitingPanel) {
			this.setActiveTab(panel);
		}

		return panel;
	}
});
