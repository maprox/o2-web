/**
 *
 * RU
 *
 */
C.utils.inherit('O.manager.Model', {
	errManagerLoad: 'Ошибка при обновлении координат<br/>{0}',
	errAjaxLoad: 'Ошибка запроса к серверу.<br/>' +
		'Адрес: <b>{0}</b><br/>' +
		'Параметры: <b>{1}</b><br/>' +
		'Код ошибки: <b>{2}</b><br/>' +
		'Описание: <b>{3}</b>',
	errAjaxLoadTimedout: 'Время ожидания ответа от сервера истекло.' +
		'Возможно соединение разорвано...<br/>' +
		'Адрес: <b>{0}</b><br/>' +
		'Параметры: <b>{1}</b>',
	errAjaxLoadInterrupt: 'Запрос к серверу прерван.<br/>' +
		'Адрес: <b>{0}</b><br/>' +
		'Параметры: <b>{1}</b>'
});

C.utils.inherit('C.utils', {
	fmtSpeedArray: ['{0} км/ч', '{0} миль/ч', '{0} м/с'],
	fmtOdometerArray: ['{0} км', '{0} миль', '{0} м']
});

_({
	'Loading...': 'Загрузка...',
	'Server connection established': 'Связь с сервером установлена',
	'Connection to sever lost': 'Связь с сервером отсутствует',
	'Please check your connection': 'Проверьте соединение',

	'Please go to the admin panel and add new device':
		'Перейдите в панель администрирования и добавьте новое устройство',
	'Please add new device': 'Добавьте новое устройство'
})