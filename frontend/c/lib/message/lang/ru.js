/**
 * @project <a href="http://maprox.net/">Мапрокс Обсервер</a>
 */
/**
 *
 * RU
 *
 */
C.utils.inherit('C.lib.message.Event', {
	title: 'Сообщение'
});

C.utils.inherit('C.lib.message.Info', {
	title: 'Информация'
});

C.utils.inherit('C.lib.message.Warning', {
	title: 'Предупреждение'
});

C.utils.inherit('C.lib.message.Error', {
	title: 'Ошибка'
});

C.utils.inherit('C.lib.message.Die', {
	title: 'Критическая ошибка'
});

C.utils.inherit('C.lib.message.Confirm', {
	title: 'Подтверждение'
});

_({
	'stacked event': 'Сообщения'
});
