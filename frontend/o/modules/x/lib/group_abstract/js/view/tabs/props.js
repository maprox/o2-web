/**
 * @class O.x.lib.group_abstract.tab.Props
 * @extends O.common.lib.modelslist.Tab
 */
C.define('O.x.lib.group_abstract.tab.Props', {
	extend: 'O.common.lib.modelslist.Tab',
	alias: 'widget.x-group-abstract-tab-props',

/**
	* Entity alias (e.g. mon_device)
	*/
	entityAlias: 'undefined_entity_alias',

/**
	 * Entity model (e.g. Mon.Device)
	 */
	entityModel: 'Undefined.Model',

	tabTitle: 'Items',

	includedTitle: 'Included items',

	availableTitle: 'Available items',

/**
	* @constructor
	*/
	initComponent: function() {

		// Available store
		this.availableStore = C.getStore(this.entityAlias, {
			sorters: [{property: 'name'}]
		});

		Ext.apply(this, {
			title: _(this.tabTitle),
			itemId: 'properties',
			layout: {
				type: 'hbox',
				align: 'stretch'
			},
			defaults: {
				hideHeaders: true,
				flex: 1,
				columns: [{
					dataIndex: 'name',
					flex: 1
				}]
			},
			items: [{
				xtype: 'gridpanel',
				itemId: 'included',
				title: _(this.includedTitle),
				multiSelect: true,
				viewConfig: {
					plugins: {
						ptype: 'gridviewdragdrop',
						dragGroup: 'itemIncluded',
						dropGroup: 'itemAvaiable'
					}
				},
				dockedItems: [{
					xtype: 'toolbar',
					dock: 'top',
					items: [{
						xtype: 'textfield',
						itemId: 'includedSearch',
						enableKeyEvents: true,
						emptyText: _('Search'),
						cls: 'modelseditor_fieldsearch',
						flex: 1
					}]
				}],
				store: Ext.create('Ext.data.Store', {
					model: this.entityModel
				})
			}, {
				xtype: 'tbspacer',
				flex: null,
				width: 10
			}, {
				xtype: 'gridpanel',
				itemId: 'available',
				title: _(this.availableTitle),
				multiSelect: true,
				viewConfig: {
					plugins: {
						ptype: 'gridviewdragdrop',
						dragGroup: 'itemAvaiable',
						dropGroup: 'itemIncluded'
					}
				},
				dockedItems: [{
					xtype: 'toolbar',
					dock: 'top',
					items: [{
						xtype: 'textfield',
						itemId: 'availableSearch',
						enableKeyEvents: true,
						emptyText: _('Search'),
						cls: 'modelseditor_fieldsearch',
						flex: 1
					}]
				}],
				store: this.availableStore
			}]
		});
		this.callParent(arguments);

		this.gridIncluded = this.down('#included');
		this.gridAvailable = this.down('#available');
	}
});
