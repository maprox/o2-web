/**
 *
 * Panel with list of object groups
 * @class O.lib.grouplist.Groups
 * @extends C.ui.Panel
 */
C.define('O.lib.grouplist.Groups', {
	extend: 'C.ui.Panel',
	alias: 'widget.groupslist_groups',

	config: {
		/**
		 * Groups data
		 * @type {Ext.util.MixedCollection}
		 */
		collection: null,
		/**
		 * Allow selecting of multiple objects (defaults to true)
		 * @type {Boolean}
		 */
		multiSelect: true,
		/**
		 * Data class alias
		 * @type {String}
		 */
		classAlias: ''
	},

/**
	* Component initialization
	*/
	initComponent: function() {
		var me = this;
		var columns = [];
		if (this.getMultiSelect()) {
			columns.push({
				dataIndex: 'enabled',
				xtype: 'checkcolumn',
				width: 28,
				listeners: {
					checkchange: function(o, index, checked) {
						var record = me.down('gridpanel').store.getAt(index);
						me.fireEvent(checked ?
							'check' : 'uncheck', record);
					}
				}
			});
		}
		columns.push({
			dataIndex: 'name',
			flex: 1
		});
		columns.push({
			xtype: 'templatecolumn',
			tpl: '{itemsCount}',
			align: 'right',
			width: 50
		});
		Ext.apply(this, {
			layout: 'fit',
			itemId: 'groupsGrid',
			items: [{
				border: false,
				xtype: 'gridpanel',
				// так обновляются, НО: в других местах приложения
				// тоже происходят изменения при редактировании тут
				//store: C.getStore('group' + this.classAlias),
				store: new Ext.data.Store({
					model: 'O.lib.grouplist.model.Group'
				}),
				viewConfig: {
					trackOver: false,
					stripeRows: false,
					getRowClass: function(record, index) {
						var cls = '';
						var type = record.get('type');
						if (type == 'selected' || type == 'searchresults') {
							cls += 'uncheckable ';
						}
						return cls + 'row_group' + type;
					}
				},
				hideHeaders: true,
				multiSelect: false,
				columns: columns,
				selType: 'rowmodel'
			}]
		});
		this.callParent(arguments);
		// init variables
		this.grid = this.down('gridpanel');
		this.gridStore = this.grid.getStore();
	}

});
