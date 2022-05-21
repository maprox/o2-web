/**
 *
 * RU
 *
 */
C.utils.inherit('O.ui.module.TrackHistory', {
	textShort: 'История поездок',
	textLong: 'Карта с историей поездок транспорта'
});

C.utils.inherit('O.act.TrackHistory', {
	msgTrackHistory: 'Список пакетов',
	lngEmptyPeriod: 'Для выбранного периода нет данных.'
});

C.utils.inherit('O.comp.DeviceHistory', {
	msgDeviceHistory: 'Детальный отчет',
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

_({
	speedColumnTemplate: '<b>Скорость</b>: {2}{0} (макс: {2}{1}).',
	odometerColumnTemplate: '<b>Пробег</b>: {1}{0} км.<br />',
	'List of objects': 'Список объектов',
	'Hide full track': 'Скрывать полный трек',
	'km': 'км',
	'Day summary': 'Итого за день',
	'Odometer': 'Пробег',
	'unreliably': 'недостоверно',
	'Moving time': 'Время движения',
	'Station time': 'Время стоянки',
	'moving': 'движение',
	'stay': 'стоянка',
	'Selected': 'Выбрано',
	'Begin': 'Начало',
	'End': 'Конец',
	'Duration':'Длит.',
	'Sensors': 'Датчики',
	'Sensor': 'Датчик',
	'Value': 'Значние',
	'Filtering condition': 'Условие',

	'Equals': 'Равно',
	'Not equals': 'Не равно',
	'Bigger than': 'Больше',
	'Lower than': 'Меньше',

	'To display sensors on map you have to select at least one track':
		'Чтобы сенсоры отобразились на карте'
		+ ' необходимо выбрать хотя бы одну поездку',

	'Skip stoppings': 'Пропускать стоянки',
	'Tracks player': 'Проигрыватель треков',
	'Reset zoom': 'Сбросить зум',
	'Receive time': 'Время пакета',

	'Follow device': 'Следовать за устройством',
	'Device properties': 'Свойства устройства',

	// mon_sensor description
	'Speed': 'Скорость',
	'Odometer': 'Пробег',
	'Longitude': 'Долгота',
	'Latitude': 'Широта',
	'Accuracy': 'Точность',
	'Azimuth': 'Азимут',
	'Altitude': 'Высота',
	'Satellites count': 'Количество спутников'
});

C.utils.inherit('O.comp.HistoryPanel', {
	msgBtnShowStoppings: 'Показать все стоянки',
	msgBtnHideStoppings: 'Убрать все стоянки',
	msgBtnHideAll: 'Убрать все',
	msgTitle: 'История поездок'
})
