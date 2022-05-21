/**
 *
 * RU
 *
 */
C.utils.inherit('O.ui.module.dn.Supplier', {
	textShort: 'Поставщики',
	textLong: 'Список поставщиков предприятия'
});

C.utils.inherit('O.act.panel.dn.SupplierList', {
	title: 'Список поставщиков',
	colRegDate: 'Регистрация',
	colCompanyName: 'Компания',
	colStatus: 'Статус',
	lngEmptyGrid: 'Нет записей',
	lngAskRemove: 'Вы уверены что хотите удалить выбранного поставщика?',
	lngAskRestore: 'Вы уверены что хотите восстановить выбранного поставщика?',
	lngBtnTrashed: 'Удаленные',
	lngBtnRestore: 'Восстановить',
	lngBtnRemove: 'Удалить'
});

C.utils.inherit('O.act.panel.dn.SupplierView', {
	title: 'Информация о поставщике'
});

C.utils.inherit('O.act.panel.dn.SupplierInfo', {
	title: 'Реквизиты',
	lngDetails: 'Реквизиты',
	lngContacts: 'Контакты',
	lngName: 'ФИО',
	lngPersonPhone: 'Телефон',
	lngWorkPhone: 'Рабочий телефон',
	lngMobilePhone: 'Мобильный телефон',
	lngEmail: 'E-mail'
});

_({
	'Documents': 'Документы',
	'File': 'Файл',
	'Download': 'Скачать',
	'Upload': 'Загрузить',
	'Requisites': 'Реквизиты',
	'Print company card': 'Распечатать',
	'Reset suplier password': 'Сбросить пароль',
	'Do you want reset password for this supplier?':
		'Сбросить пароль для поставщика?',
	'The password has been reset': 'Пароль для поставщика сброшен',
	'Upload files': 'Загрузить файлы',
	'Email is not specified': 'Email не указан',
	'Phone is not specified': 'Телефон не указан',
	'Export list': 'Выгрузить список',
	'Activate': 'Активировать',
	'Disable': 'Отключить',
	'Enable': 'Включить',
	'Disabled': 'Отключен',
	'Are you sure you want to activate selected supplier?':
		'Вы уверены, что хотите активировать выбранного поставщика?',
	'Are you sure you want to disable selected supplier?':
		'Вы уверены, что хотите отключить выбранного поставщика?',
	'Are you sure you want to enable selected supplier?':
		'Вы уверены, что хотите включить выбранного поставщика?',
	'Supplier account is successfully deleted':
		'Учетная запись поставщика удалена',
	'Supplier account is successfully restored':
		'Учетная запись поставщика восстановлена',
	'Supplier account is successfully activated':
		'Учетная запись поставщика успешно активирована',
	'Supplier account is successfully disabled':
		'Учетная запись поставщика отключена',
	'Supplier account is successfully enabled':
		'Учетная запись поставщика включена',
	'Mailing': 'Рассылка',
	'Mailing window': 'Окно рассылки',
	'Title': 'Заголовок',
	'Suppliers': 'Поставщики',
	'Sending message to suppliers':
		'Рассылка сообщения поставщикам',
	'Your message has been queued for delivery':
		'Рассылка поставлена в очередь отправки'
}),


C.utils.inherit('O.act.panel.dn.SupplierDocs', {
	lngWaitMsg: 'Пожалуйста, подождите...',
	lngMsgUploaded: 'Документ успешно загружен',
	lngMsgRemoveTitle: 'Удалить документ?',
	lngMsgRemoveText: 'Вы действительно хотите удалить документ?',
	lngMsgRemoved: 'Документ успешно удален'
});

C.utils.inherit('modelSupplierAccount', {
	lngStatusWaitingForApproval: 'Ожидает',
	lngStatusWorking: 'Работает',
	lngStatusTrashed: 'Удален'
})