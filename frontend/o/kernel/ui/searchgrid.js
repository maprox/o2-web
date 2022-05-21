/**
 */
/**
 * Base class for searchable grid
 * @class O.ui.SearchGrid
 * @extends Ext.grid.Panel
 */
Ext.define('O.ui.SearchGrid', {
	extend: 'Ext.grid.Panel',
	alias: 'widget.osearchgrid',

	/**
	 * Empty title for search field.
	 * Have to be re-assigned.
	 * {String}
	 */
	searchTitle: '',

	/**
	 * Init default paging toolbar
	 * {Boolean}
	 */
	defaultPaging: true,

	/**
	 * Use Search Toolbar
	 * {Boolean}
	 */
	useSearch: true,

	/**
	 * Names of grid store fields, whish is searched.
	 * Have to be re-assigned.
	 * {String[]}
	 */
	searchProperties: null,

	/**
	 * grouping config
	 */
	groupConfig: [{
		ftype: 'grouping',
		enableGroupingMenu: false,
		groupHeaderTpl: '{[O.ui.SearchGrid.getGroupHeader(values)]}'
	}],

	/**
	 * Array of objects {title, property} to be turned into grouping buttons.
	 * {Array}
	 */
	groupButtons: null,

	/**
	 * Array of string containing group buttons ids.
	 * {Array}
	 */
	buttonIds: null,

	/**
	 * Default grouping property title.
	 * {String}
	 */
	defaultGroupTitle: null,
	defaultGroupTpl: null,

	/**
	 * Empty array, to collect items on the upper toolbar.
	 * {Array}
	 */
	toolbarAddItems: [],

	statics: {
		getGroupHeader: function (values) {
			var id = values.name,
				view = Ext.getCmp(values.viewId),
				store = view.getStore(),
				group = store.getGroups(id),
				record = group.children[0],
				groupTitle = view.groupTitle,
				tpl = view.groupTpl;

			if (Ext.isEmpty(record)) {
				return "";
			}

			if (typeof groupTitle == "string") {
				groupTitle = [groupTitle];
			}

			if (tpl === false) {
				return record.get(groupTitle[0]);
			}

			Ext.each(groupTitle, function(valueType) {
				var value = record.get(valueType),
					regex = new RegExp('\\{' + valueType + '\\}', 'ig');

				tpl = tpl.replace(regex, value);
			});

			tpl = tpl.replace(/\{\[(.*?)\]\}/g, function (str, p1) {
				return eval(p1);
			});

			return tpl;
		}
	},

	/**
	* Initialization
	*/
	initComponent: function() {
		this.buttonIds = [];

		this.features = Ext.clone(this.groupConfig);
		this.toolbarItems = Ext.clone(this.toolbarAddItems);

		this.callParent(arguments);

		if (this.defaultPaging) {
			this.initPaging();
		}

		Ext.each(this.groupButtons, this.addButton, this);
		Ext.apply(this, {
			features: this.groupConfig
		});

		if (this.useSearch && this.searchProperties.length > 0) {
			this.initSearch();

			this.store.on('clear', this.clearSearchField, this);
		}

		if (this.toolbarItems.length > 0) {
			this.addDocked({
				xtype: 'toolbar',
				itemId: 'searchbar',
				dock: 'top',
				items: this.toolbarItems
			});
		}

		this.view.groupTitle = this.defaultGroupTitle;
		this.view.groupTpl = this.defaultGroupTpl;
	},

	/**
	 * Add paging toolbar
	 */
	initPaging: function() {
		var grid = this;
		this.addDocked({
			xtype: 'pagingtoolbar',
			store: this.store,
			dock: 'bottom',
			displayInfo: true,
			doRefresh: function() {
				// TODO: this is hack
				grid.fireEvent('gridrefresh');

				var me = this,
						current = me.store.currentPage;

				if (me.fireEvent('beforechange', me, current) !== false) {
					me.store.loadPage(current);
				}
			}
		});
	},

	/**
	 * Add search to upper toolbar,
	 * happens only if this.searchProperty is defined
	 */
	initSearch: function() {

		var searchProperties = this.searchProperties;

		this.toolbarItems.push({
				xtype: 'tbfill'
			},
			this.searchTitle,
			{
				xtype: 'textfield',
				itemId: 'searchfield',
				hideLabel: true,
				width: 300,
				listeners: {
					change: function(search) {
						var panel = this.up("gridpanel");

						panel.store.clearFilter();

						if (searchProperties.length == 1) {

							panel.store.filter({
								property: searchProperties[0],
								value: search.value,
								anyMatch: true
							});
						} else {
							var matchString = search.value.toLowerCase();
							panel.store.filter({
								filterFn: function(item) {
									for (var key in searchProperties) {
										var field = item.data[searchProperties[key]];

										if (
											typeof field == "string" &&
											field.toLowerCase().
												indexOf(matchString) != -1
										) {
											return true;
										}
									}

									return false;
								}
							});
						}

						if (this.defaultPaging) {
							panel.store.loadPage(1);
						}
					}
				}
			}
		);
	},

	/**
	 * Add grouping button to upper toolbar,
	 * @button {Object} Consists of .title, .defaultGroup and .property
	 */
	addButton: function (button) {
		var listener, pressed = false;

		if (typeof button.groupTitle == "undefined") {
			button.groupTitle = button.property;
		}

		if (button.defaultGroup === true) {
			this.defaultGroup = button.property;
			this.defaultGroupTitle = button.groupTitle;
			this.defaultGroupTpl = button.groupTpl || false;
			pressed = true;
		}

		if (button.property != undefined) {
			listener = {
				click: function() {
					var panel = this.up("gridpanel");

					panel.view.groupTitle = this.hideColumn;
					panel.view.groupTpl = this.groupTpl;

					panel.store.clearGrouping();
					panel.store.group(button.property);
					panel.store.loadPage(1);

					var myId = this.itemId;
					Ext.each(panel.buttonIds, function(id) {
						var pressed = (myId == id);
						this.getComponent("searchbar").
							getComponent(id).toggle(pressed);
					}, panel);

					var hideColumn = this.hideColumn;
					Ext.each(panel.columns, function(column) {
						var hide = Ext.Array.indexOf(hideColumn, column.dataIndex);

						if (hide != -1) {
							column.hide();
						} else {
							column.show();
						}
					});
				}
			};
		} else {
			listener = {
				click: function() {
					var panel = this.up("gridpanel");

					panel.store.clearGrouping();
					panel.store.loadPage(1);

					var myId = this.itemId;
					Ext.each(panel.buttonIds, function(id) {
						var pressed = (myId == id);

						this.getComponent("searchbar").
							getComponent(id).toggle(pressed);
					}, panel);

					Ext.each(panel.columns, function(column) {
						column.show();
					});
				}
			};

			button.property = 'clear';
		}

		if (typeof button.groupTitle == "string") {
			button.groupTitle = [button.groupTitle];
		}

		this.toolbarItems.push({
			xtype: 'button',
			itemId: 'button' + button.property,
			text: button.title,
			listeners: listener,
			pressed: pressed,
			hideColumn: button.groupTitle,
			groupTpl: button.groupTpl || false
		});

		this.buttonIds.push('button' + button.property);
	},

	clearSearchField: function() {
		this.down("#searchfield").setValue("");
	}
});
