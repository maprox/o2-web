/**
 *
 * @class O.dn.act.pricerequest.Editor
 * @extends C.ui.Panel
 */
C.define('O.dn.act.pricerequest.AnswerLines', {
	extend: 'C.ui.Panel',
	alias: 'widget.pricesrequest_answerlines',

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
				store: 'pricesRequestAnswerLines',
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
					flex: 3
				}, {
					text: this.colPrice,
					xtype: 'templatecolumn',
					dataIndex: 'price',
					tpl: '{[values.price]} руб.',
					flex: 1
				}, {
					xtype: 'templatecolumn',
					text: this.colPriceTotal,
					tpl: '{[values.price * values.amount]} руб.',
					flex: 1
				}],
				selType: 'rowmodel'
			}]
		});

		this.callParent(arguments);
	}

});
