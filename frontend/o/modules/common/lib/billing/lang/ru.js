C.utils.inherit('O.lib.billing.List', {
	lngAddBtn: 'Создание счета предприятия'
});

C.utils.inherit('O.lib.billing.tab.Invoice', {
	msgAskDelete: 'Вы действительно хотите удалить этот счет на оплату?'
});

_({
	'Export billing history': 'Экспорт истории операций',
	'Format': 'Формат',
	'Starting with': 'Начиная с',
	'Ending with': 'Заканчивая',

// INFORMATION TAB
	'Account number': 'Номер счета',
	'Creation date': 'Дата создания',
	'Tariff': 'Тариф',
	'Limit value': 'Порог отключения',
	'Refill': 'Пополнить',
	'Amount': 'Сумма',
	'Payment method': 'Способ оплаты',
	'Billing disabled': 'Биллинг отключен',
	'Activates after': 'Вступает в силу с',

// INVOICE TAB
	'Invoices': 'Выписанные счета',
	'Status': 'Статус',
	'Invoice #': '№ счета',
	'Payment type': 'Метод оплаты',
	'Payment date': 'Дата оплаты',
	'Cancel request': 'Отменить заявку',
	'Pay': 'Оплатить',
	'Print': 'Распечатать',
	'Was paid': 'Оплачено',
	'invoiceStatus1': 'Создано',
	'invoiceStatus2': 'Ожидает перевода',
	'invoiceStatus3': 'Оплачено',

// ACT TAB
	'Acts': 'Акты',
	'Act #': '№ акта',
	'Create act': 'Создать акт',
	'Issue date (need to select the last day of the month)':
		'Дата выдачи (неоходимо выбрать последний день месяца)',
	'Do you realy want to delete selected act?':
		'Вы действительно хотите удалить выбранный акт?',

// HISTORY TAB
	'History': 'История операций',
	'TID': 'TID',
	'Operation': 'Операция',
	'Sum': 'Сумма',
	'VAT': 'НДС',
	'Note': 'Примечание',
	'Balance': 'Баланс',
	'debit': 'расход',
	'refill': 'приход',
	'action': 'действие',
	'Daily debiting': 'Ежедневное списание',
	'Account refill': 'Пополнение баланса',
	'invoiceNum': ' по счету №',
	'Unique transaction identifier': 'Уникальный идентификатор транзакции',
	'Fee': 'Плата',
	'Total count': 'Кол-во',
	'Payed count': 'Кол-во платных',
	'Total': 'Итого',
	'Debit date': 'Расчетная дата',
	'License fee': 'Абонентская плата',
	'No billing history yet': 'Нет истории операций по данному лицевому счету',
	'': ''
});


C.utils.inherit('O.window.PendingPayment', {
	title: 'Счет на оплату',
	pendingPaymentTpl: '<table class="payment_window"><tr>'+
			'<th>Счет номер {id}</th>'+
			'<th>Дата платежа</th>'+
			'<th>Платежная система</th>'+
			'<th>Сумма (руб.)</th>'+
		'</tr><tr>'+
			'<td>Детали: </td>'+
			'<td>{sdt}</td>'+
			'<td>{payment_name}</td>'+
			'<td>{amount}</td>'+
		'</tr><tr>'+
			'<td>На счет поступит: </td>'+
			'<td></td>'+
			'<td></td>'+
			'<td>{amount}</td>'+
	'</tr></table>',
	lngBtnPendingCancel: 'Отмена',
	lngBtnPendingDo: 'Перейти к оплате',
	paymentErrorAlert: 'Эта платежная система еще не подключена'
});

C.utils.inherit('O.window.EditAccountLimit', {
	title: 'Изменить порог отключения',

	lngBtnDo: 'Изменить порог',
	lngNewAccountLimit: 'Новый порог отключения',
	lngNewAccountLimitDate: 'Дата окончания действия',
	lngNewAccountLimitPermanent: 'Сделать постоянным'
});

C.utils.inherit('O.window.EditAccountTariff', {
	title: 'Изменить текущий тариф',

	lngBtnDo: 'Изменить тариф',
	lngNewAccountTariff: 'Новый тариф'
});

C.utils.inherit('O.window.EditAccountBalance', {
	title: 'Редактирование баланса',

	lngBtnDo: 'Изменить баланс',
	lngCurrentBalance: 'Текущий баланс',
	lngChangeBalance: 'Изменить на',
	lngMethod: 'Способ оплаты',
	lngNote: 'Примечание'
});
