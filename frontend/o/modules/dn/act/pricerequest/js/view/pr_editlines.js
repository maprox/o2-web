/**
 *
 * @class O.dn.act.pricerequest.Editor
 * @extends C.ui.Panel
 */
C.define('O.dn.act.pricerequest.EditorLines', {
	extend: 'C.ui.Panel',
	alias: 'widget.pricesrequest_editorlines',

/**
	* Display empty warehouses button text
	* @cfg {String}
	*/
	displayEmpty: 'Display empty',

/**
	* Column names
	*/
	colArticle: 'Article',
	colGoods: 'Goods',
	colGoodsType: 'Nomenclatura',
	colAmount: 'Amount',

/**
	* Search phrase
	*/
	searchTitle: 'Search:',

/**
	* Component initialization
	*/
	initComponent: function() {
		var me = this;
		me.emptyButton = Ext.create('Ext.button.Button', {
			text: this.displayEmpty,
			pressed: true,
			enableToggle: true,
			stateful: true,
			stateId: 'editlines-hide-empty',
			itemId: 'editlines-hide-empty',
			stateEvents: ['toggle', 'load'],
			getState: function() {
				return {
					pressed: this.pressed
				}
			}
		});

		Ext.apply(this, {
			layout: 'fit',
			items: [{
				xtype: 'osearchgrid',
				store: 'pricesRequestEditLines',
				searchTitle: this.searchTitle,
				searchProperties: ["product", "code"],

				toolbarAddItems: [me.emptyButton],

				columns: [{
					text: this.colArticle,
					dataIndex: 'code',
					flex: 2
				}, {
					text: this.colGoods,
					dataIndex: 'product',
					flex: 6
				}, {
					text: this.colGoodsType,
					dataIndex: 'nomenclature',
					flex: 1
				}, {
					text: this.colAmount,
					dataIndex: 'amount',
					flex: 3,
					editor: {
						allowBlank: true
					}
				}],
				selType: 'rowmodel',
				plugins: [Ext.create('Ext.grid.plugin.CellEditing', {
					pluginId: 'editor',
					clicksToEdit: 1
				})]
			}]
		});

		this.callParent(arguments);
	}

});
