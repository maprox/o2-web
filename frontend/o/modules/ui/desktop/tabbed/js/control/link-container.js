/**
 * @class O.ui.LinkContainer
 */
C.utils.inherit('O.ui.LinkContainer', {
/**
	* @constructor
	*/
	initComponent: function() {
		this.callParent(arguments)
		C.get('settings', function(s) {
			this.setText(C.getSetting("p.login", s));
		}, this);

	},

/**
	* Adds a link to link-container
	* @param {Object/C.ui.Module} config Configuration object.
	* Can be one of the examples above:
	*  * [C.ui.Module]
	*  * {module: [C.ui.Module], handler: [Function]}
	*  * {title: [String], alt: [String], cls: [String], handler: [Function]}
	*/
	addLink: function(config) {
		var module = config;
		if (config instanceof C.ui.Module) {
			Ext.apply(config, {
				title: module.textShort,
				alt: module.textLong,
				cls: module.id,
				handler: Ext.bind(module.activate, module)
			});
		} else if (config.module && config.handler) {
			module = config.module;
			Ext.apply(config, {
				title: module.textShort,
				alt: module.textLong,
				cls: module.id
			});
		}
		if (module.id === 'logout') {
			this.menu.add({
				xtype: 'menuseparator'
			});
		}
		this.menu.add({
			iconCls: config.cls,
			text: config.title,
			tooltip: config.alt,
			handler: config.handler
		});
	}

});