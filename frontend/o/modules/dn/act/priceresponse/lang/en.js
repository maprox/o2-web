/**
 *
 * EN
 *
 * There is no need in this file.
 * Keep it here for further translations.
 *
 */
C.utils.inherit('O.ui.module.PricesResponses', {
	textShort: 'Payment Responses',
	textLong: 'Payment Responses'
});

C.utils.inherit('O.dn.act.priceresponse.List', {
	title: 'List of prices Responses',

	colNum: '№',
	colDateStart: 'Creation date',
	colDateEnd: 'End date',
	colStatus: 'Status',

	msgAccept: 'Respond',

	msgConfirmation: 'Confirmation',
	msgAskAccept: 'Do you realy want to send selected prices response?'
});

C.utils.inherit('O.dn.act.priceresponse.Editor', {
	title: 'Prices response contents'
});


C.utils.inherit('O.dn.act.priceresponse.EditorList', {
	colWarehouse: 'Warehouse',
	colAddress: 'Address'
});

C.utils.inherit('O.dn.act.priceresponse.EditorLines', {
	colArticle: 'Article',
	colGoods: 'Goods',
	colGoodsType: 'Nomenclatura',
	colAmount: 'Amount',
	colPrice: 'Price',
	colPriceTotal: 'Total price',
	searchTitle: 'Search:'
});
