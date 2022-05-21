/**
 *
 * RU
 *
 */

C.utils.inherit('O.ui.module.Settings', {
	textShort: 'Настройки',
	textLong: 'Личные настройки пользователя'
});

C.utils.inherit('O.comp.settings.personal.Base', {
	title: 'Общие настройки',
	tabTip: 'Редактирование базовых настроек',
	msgUILanguage: 'Язык интерфейса',
	msgTimeZone: 'Часовой пояс',
	msgSyncPeriod: 'Период синхронизации',
	msgEmail: 'E-mail адрес',
	msgFirstName: 'Имя',
	msgSecondName: 'Отчество',
	msgLastName: 'Фамилия',
	msgWorkPhone: 'Рабочий телефон',
	msgMobilePhone: 'Мобильный телефон'
});

// Translations
_({
	'Company settings': 'Настройки предприятия',
	'UI Language': 'Язык интерфеса',
	'Time zone': 'Часовой пояс',
	'Base settings': 'Общие настройки',
	'Requisites': 'Реквизиты',

	'Authorization': 'Авторизация',
	'Login': 'Логин',
	'Current password': 'Текущий пароль',
	'New password': 'Новый пароль',
	'Password confirmation': 'Подтверждение пароля',

	'E-mail': 'Электронная почта',
	'Personal settings': 'Личные настройки',
	'Phone numbers': 'Телефонные номера',
	'Notice settings': 'Настройки оповещений',
	'Reaching payment threshold':
		'Приближение баланса к порогу отключения',
	'Maximum points count on device last track':
		'Максимальное количество последних отображаемых точек пути',
	'Monthly acts sending': 'Ежемесячная отправка актов',
	'Changes of the account balance': 'Изменения баланса лицевого счета',
	"Don't notify": 'Не уведомлять',
	'Account setting': 'Настройки аккаунта',
	'Share key': 'Ключ доступа',
	'Generate new key': 'Создать новый ключ',
	'Base settings': 'Общие настройки',
	'Settings saved successfully': 'Настройки успешно сохранены',
	'Api key': 'Api-ключ',

	'Delete account': 'Удалить аккаунт',
	'Your account will be removed permanently!':
		'Удаление аккаунта является необратимой процедурой!',
	'All your objects will be deleted: devices, users, etc.':
		'Будут удалены все объекты в системе: устройства, пользователи и т.д.',
	'Do you really want to delete your account?':
		'Вы действительно хотите удалить аккаунт?'
});

C.utils.inherit('O.comp.settings.map.Base', {
	title: 'Карта',
	tabTip: 'Изменение настроек карты',
	msgDeviceBase: 'Настройки отображения устройств',
	msgDeviceLabels: 'Настройки блока информации об устройстве',
	msgLabelPosition: 'Положение',
	msgLabelRow1: 'Первая строка',
	msgLabelRow2: 'Вторая строка',
	msgLabelRow3: 'Третья строка',
	msgDeviceHistory: 'Настройки истории поездок',
	msgEventsPeriod: 'Показать события за'
});

C.utils.inherit('O.comp.settings.notification.Base', {
	title: 'Уведомления',
	tabTip: 'Настройка методов уведомления',
	colActive: 'Активно',
	colType: 'Тип уведомления',
	colAddress: 'Адрес',
	colInformation: 'Информация',
	colMedium: 'Средняя важность',
	colHigh: 'Высокая важность',
	colCritical: 'Критическая важность',
	msgCreate: 'Новый способ уведомления',
	msgDelete: 'Удалить способ уведомления',
	msgEdit: 'Редактировать способ уведомления',
	msgConfirmation: 'Подтверждение',
	msgAskDelete: 'Вы действительно хотите удалить этот способ уведомления?',
	msgUnknownType: 'Неправильный способ уведомлений',
	msgIncorrectEmail: 'Неправильный E-mail',
	msgIncorrectPhone: 'Неправильный номер телефона'
});

C.utils.inherit('O.comp.settings.Welcome', {
	title: 'Текст приветствия',
	tabTip: 'Редактирование текста приветствия',
	msgWelcomeText: 'Текст приветствия'
});

Ext.data.StoreManager.lookup('deviceLabelPositionsStore').loadData([
	{ id: 1, position: 'Слева' },
	{ id: 2, position: 'Справа' },
	{ id: 3, position: 'Сверху' },
	{ id: 4, position: 'Снизу' }
]);

Ext.data.StoreManager.lookup('eventsPeriodsStore').loadData([
	{ value: 1, text: 'За час' },
	{ value: 12, text: 'За 12 часов' },
	{ value: 24, text: 'За сутки' },
	{ value: 48, text: 'За двое суток' },
	{ value: 168, text: 'За неделю' }
]);
