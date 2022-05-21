/**
 *
 * RU
 * 
 */
C.utils.inherit('O.ui.module.dn.Offer', {
	textShort: 'Коммерческие предложения',
	textLong: 'Коммерческие предложения'
});

C.utils.inherit('O.act.dn.offer.Panel', {
	lngSaveChangesText: 'Хотите ли Вы сохранить внесенные изменения?'
});

C.utils.inherit('O.lib.prodsupply.offer.List', {
	lngSendConfirmText: 'Вы действительно хотите отправить коммерческое'
		+ ' предложение?',
	lngRemoveConfirmText: 'Вы действительно хотите удалить коммерческое'
		+ ' предложение?',
	lngAddedText: 'Коммерческое предложение успешно создано',
	lngSendedText: 'Коммерческое предложение успешно отправлено',
	lngRemovedText: 'Коммерческое предложение успешно удалено'
});

C.utils.inherit('O.lib.prodsupply.offer.AddPriceWindow', {
	lngEmptyProducts: 'Вы не указали ни одной цены на продукт.<br/>' +
		'Нет данных для добавления в коммерческое предложение.<br/>' +
		'Вы действительно хотите закрыть данное окно?',
	lngEmptyRegions: 'Вы не выбрали ни одного региона.<br/>' +
		'Нет данных для добавления в коммерческое предложение.<br/>' +
		'Вы действительно хотите закрыть данное окно?'
});

_({
	'Adding product prices': 'Добавление цен на продукцию',
	'Regions': 'Регионы',
	'Warehouse': 'Склад',
	'Warehouses': 'Склады',
	'Supplier': 'Поставщик',
	'Measure': 'Ед. изм.',
	'By region': 'По региону',
	'By product': 'По товару',
	'Without grouping': 'Без группировки',
	'Offer saved successfully': 'Коммерческое предложение успешно сохранено',
	'My warehouses': 'Мои склады',
	'Distribution centers': 'Распределительные центры',
	'Add warehouse': 'Добавить склад',
	'Measure': 'Ед. измерения',
	'Amount': 'Требуемый объем'
});