/**
 *
 * @class O.dn.act.priceresponse.Editor
 * @extends C.ui.Panel
 */
C.define('O.dn.act.priceresponse.EditorLines', {
	extend: 'C.ui.Panel',
	alias: 'widget.pricesresponse_editorlines',

	disabled: true,

/**
	* Column names
	*/
	colWarehouse: 'Warehouse',
	colArticle: 'Article',
	colGoods: 'Goods',
	colGoodsType: 'Nomenclatura',
	colAmount: 'Amount',
	colPrice: 'Price',
	colPriceTotal: 'Total price',

/**
	* Buttons names
	*/
	groupByPlace: 'Group by warehouse',
	groupByGood: 'Group by goods',
	noGroup: 'Cancel grouping',

	searchTitle: 'Search:',

/**
	* Component initialization
	*/
	initComponent: function() {
		Ext.apply(this, {
			layout: 'fit',
			items: [{
				xtype: 'osearchgrid',
				store: 'pricesResponseEditLines',
				searchTitle: this.searchTitle,
				searchProperties: ["product", "code"],

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
					flex: 1
				}, {
					text: this.colPrice,
					xtype: 'templatecolumn',
					dataIndex: 'price',
					tpl: '{[values.price == 0 ?'+
						' "Введите цену" :'+
						' values.price + " руб."]}',
					flex: 2,
					editor: {
						allowBlank: true
					}
				}, {
					xtype: 'templatecolumn',
					text: this.colPriceTotal,
					tpl: '{[values.price == 0 ?'+
						' "" :'+
						' values.price * values.amount + " руб."]}',
					flex: 1
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
