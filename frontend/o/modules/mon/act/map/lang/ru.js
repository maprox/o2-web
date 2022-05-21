/**
 *
 * RU
 *
 */
C.utils.inherit('O.ui.module.Map', {
	textShort: 'Карта',
	textLong: 'Карта мониторинга транспорта'
});

C.utils.inherit('O.comp.DeviceInfo', {
	msgDeviceProperties: 'Свойства',
	msgDeviceEvents: 'События',
	deviceInfo_tpl_Name: 'Наименование',
	deviceInfo_tpl_Id: 'Идентификатор',
	deviceInfo_tpl_LastData: 'Последние данные',
	deviceInfo_tpl_DataLoadTime: 'Время получения',
	deviceInfo_tpl_Speed: 'Скорость',
	deviceInfo_tpl_Coord: 'Координаты',
	deviceInfo_tpl_Place: 'Место',
	deviceInfo_tpl_NoData: 'Нет данных'
});

C.utils.inherit('O.map.Panel', {
	lngLoadErrTitle: 'Ошибка загрузки',
	lngLoadErrText: 'Возникла ошибка при загрузке карты',
	lngAllDisTitle: 'Нет доступных карт',
	lngAllDisText: 'Все карты недоступны. Пожалуйста, попробуйте позже'
});

C.utils.inherit('O.comp.DeviceInfoPanel', {
	msgTitle: 'Информация об устройстве'
});

_({
	'Properties': 'Свойства',
	'List of objects': 'Список объектов',
	'Create geofence': 'Создать геозону',
	'Follow selected': 'Следить за выбранными',
	'Show last points': 'Показать путь',
	'Show labels': 'Показать метки',
	'Waylist': 'Путевой лист',
	'Serial number': 'Серийный номер',
	'Date': 'Дата',
	'Driver FIO': 'ФИО водителя',
	'Completed': 'Выполнено',
	'Previous point': 'Предыдущий пункт',
	'Next point': 'Следующий пункт',
	'before point': 'до пункта',
	'overdue': 'опоздание',
	'Show on map': 'Показать на карте',
	'Call': 'Позвонить',
	'End call': 'Завершить',
	'Commands': 'Команды',
	'Command has been sent': 'Команда отправлена',
	'Drivers': 'Водители',
	'Assign...': 'Назначить...',
	'Dismiss': 'Снять',
	'No drivers assigned': 'Нет назначенных водителей'
});