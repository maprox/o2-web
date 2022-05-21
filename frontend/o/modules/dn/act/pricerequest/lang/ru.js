/**
 *
 * RU
 *
 */
C.utils.inherit('O.ui.module.PricesRequests', {
	textShort: 'Тендеры',
	textLong: 'Тендеры'
});

C.utils.inherit('O.dn.act.pricerequest.List', {
	colNum: '№',
	colDateStart: 'Дата начала',
	colDateEnd: 'Дата завершения',

	msgCreate: 'Создать',
	msgDelete: 'Удалить',
	msgAccept: 'Опубликовать',
	colStatus: 'Статус',

	msgConfirmation: 'Подтверждение',
	msgAskDelete: 'Вы уверены, что желаете удалить выделенный тендер?',
	msgAskAccept: 'Вы уверены что хотите опубликовать сформированный тендер?',
	msgAlertNoDate: 'Перед публикацией тендера, вам необходимо задать дату завершения',
	msgAlertOldDate: 'Вы не можете опубликовать тендер с уже прошедшей датой завершения'
});

C.utils.inherit('O.dn.act.pricerequest.Editor', {
	title: 'Содержимое тендера'
});

C.utils.inherit('O.dn.act.pricerequest.EditorLines', {
	displayEmpty: 'Показывать пустые',
	colArticle: 'Артикул',
	colGoods: 'Товар',
	colGoodsType: 'Единицы',
	colAmount: 'Количество',
	searchTitle: 'Искать:'
});

C.utils.inherit('O.dn.act.pricerequest.EditorList', {
	colWarehouse: 'Склад',
	displayEmpty: 'Показывать пустые',
	colAddress: 'Адрес',
	searchTitle: 'Искать:'
});

C.utils.inherit('O.dn.act.pricerequest.Answer', {
	title: 'Отклики на этот тендер',
	colFirm: 'Откликнувшаяся фирма',
	colDate: 'Дата ответа'
});

C.utils.inherit('O.dn.act.pricerequest.AnswerLines', {
	title: 'Содержимое отклика',
	colWarehouse: 'Склад',
	colArticle: 'Артикул',
	colGoods: 'Товар',
	colGoodsType: 'Единицы',
	colAmount: 'Количество',
	colPrice: 'Цена за ед.',
	colPriceTotal: 'Цена всего',
	groupByPlace: 'Группировать по складам',
	groupByGood: 'Группировать по товарам',
	noGroup: 'Отменить группировку',
	searchTitle: 'Искать:'
});

_({
	'Tenders list': 'Список тендеров',
	'Export': 'Экспорт',
	'Swap columns': 'Поменять столбцы',
	'Consolidated report': 'Консолидированный отчет',
	'The consolidated report of the tender': 'Сводный отчет о тендере',
	'Product': 'Продукт',
	'Supplier': 'Поставщик',
	'Totals': 'Суммарно',
	'Product amount': 'Требуемый объем',
	'Hide disabled': 'Скрывать отключенных',
	'Tender totals': 'Итоги тендера',
	'Distribution by places': 'Распределение по местам',
	'1st place': '1 место',
	'2nd place': '2 место',
	'3rd place': '3 место',
	'Winner': 'Победитель'
});