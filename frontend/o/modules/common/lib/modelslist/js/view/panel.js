/**
 * New modelseditor panel view
 * @class O.common.lib.modelslist.Panel
 * @extends C.ui.Panel
 */
C.define('O.common.lib.modelslist.Panel', {
	extend: 'C.ui.Panel',
	alias: 'widget.common-lib-modelslist-panel',

	model: 'undefined-model',
	managerAlias: 'undefined-manager-alias',

/**
	* Tabs aliases
	* @type String[]
	*/
	tabsAliases: null,

/**
	* Returns individual tabs config objects
	* @return Object[]
	*/
	getTabsParams: function() {
		return {};
	},

/**
	* @constructor
	*/
	initComponent: function() {
		if (!this.tabsAliases) {
			this.tabsAliases = [];
		}

		var list = Ext.apply({
			stateful: true,
			stateId: 'list-' + this.managerAlias,
			xtype: 'common-lib-modelslist-list',
			itemId: 'list',
			region: 'west',
			split: true,
			width: 300,
			model: this.model,
			managerAlias: this.managerAlias
		}, this.listConfig || {});

		var tabs = Ext.apply({
			stateful: true,
			stateId: 'tabs-' + this.managerAlias,
			xtype: 'common-lib-modelslist-tabs',
			itemId: 'tabs',
			region: 'center',
			model: this.model,
			managerAlias: this.managerAlias,
			tabsAliases: this.tabsAliases,
			tabsParams: this.getTabsParams()
		}, this.tabsConfig || {});

		Ext.apply(this, {
			layout: 'border',
			items: [list, tabs]
		});
		this.callParent(arguments);

		// init component links for quick access
		this.list = this.down('#list');
		this.tabs = this.down('#tabs');
	}
});
