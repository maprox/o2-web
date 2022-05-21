/**
 *
 * RU
 *
 */
C.utils.inherit('O.ui.module.PricesResponses', {
	textShort: 'Тендеры',
	textLong: 'Тендеры'
});

C.utils.inherit('O.dn.act.priceresponse.List', {
	title: 'Список тендеров',

	colNum: '№',
	colDateStart: 'Дата начала',
	colDateEnd: 'Дата завершения',
	colStatus: 'Статус'
});

C.utils.inherit('O.dn.act.priceresponse.Editor', {
	title: 'Содержимое тендера'
});

C.utils.inherit('O.dn.act.priceresponse.EditorList', {
	colWarehouse: 'Склад',
	colAddress: 'Адрес'
});

C.utils.inherit('O.dn.act.priceresponse.EditorLines', {
	colArticle: 'Артикул',
	colGoods: 'Товар',
	colGoodsType: 'Единицы',
	colAmount: 'Количество',
	colPrice: 'Цена за ед.',
	colPriceTotal: 'Цена всего',
	searchTitle: 'Искать:'
});

_({
	'Respond': 'Откликнуться',
	'Cancel response': 'Отменить публикацию',
	'Confirmation': 'Подтверждение',
	'Do you really want to cancel the response?':
		'Вы действительно хотите отменить публикацию?',
	'Do you really want to send selected prices response?':
		'Вы уверены что хотите ответить на этот тендер?'
});