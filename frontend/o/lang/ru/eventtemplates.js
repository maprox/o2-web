/**
 *
 * RU
 *
 */
/**
 * @class O.lng.eventTemplates
 */
Ext.define('O.lng.eventTemplates', {
	singleton: true,

	panel: {
		tpl: {
			1: { //получение пакета данных
				any: 'Устройство ' +
					'{[this.getName(values.devices.get(values.event.ownerid))]}' +
					' - получен пакет данных'
			},
			5: {
				any: 'Устройство ' +
					'{[this.getName(values.devices.get(values.event.ownerid))]} переименовано'
			},
			7: { //включение/отключение
				349: 'Устройство ' +
					' {[this.getName(values.devices.get(values.event.ownerid))]} отключен',
				7488: 'Устройство ' +
					' {[this.getName(values.devices.get(values.event.ownerid))]} включен'
			},
			18: {
				any: 'Вход в систему ({[Ext.JSON.decode(values.event.eventval).ip]})'
			},
			19: {
				any: 'Выход из системы'
			},
			20: {
				any: 'Устройство ' +
					'{[this.getName(values.devices.get(values.event.ownerid))]} ' +
					'&mdash; связь восстановлена'
			},
			21: { //расшаривание
				denyall:
					'Доступ к {[this.getName(values.devices.get(values.event.ownerid))]}' +
					' запрещен для всех внешних пользователей',
				allowall:
					'Доступ к {[this.getName(values.devices.get(values.event.ownerid))]}' +
					' предоставлен всем пользователям',
				allowselected:
					'Доступ к {[this.getName(values.devices.get(values.event.ownerid))]} ' +
					'предоставлен списку выбранных пользователей'
			},
			22: { //удаление из всех групп
				0: 'Устройство ' +
					' {[this.getName(values.devices.get(values.event.ownerid))]} ' +
					' удалено из всех групп'
			},
			/*23: { //добавление в группу
				any: 'Устройство ' +
					' {[this.getName(values.devices.get(values.event.ownerid))]} ' +
					' добавлено в группу ' +
					'{[this.getName(values.groupdevices.get(values.event.eventval))]}'
			},*/
			24: { //Связь с устройством
				any: 'Устройство ' +
					' {[this.getName(values.devices.get(values.event.ownerid))]} ' +
					'&mdash; связь потеряна'
			},
			28: { //уведомление
				any: '{[values.event.eventval]}'
			},
			29: { //тревога
				any: 'Устройство ' +
					' {[this.getName(values.devices.get(values.event.ownerid))]} ' +
					' послало сигнал тревоги!'
			},
			30: { //ошибка в платеже
				any: '{[values.event.eventval ? '+
					'"Проблемы с зачислением платежа" : ' +
					'"Проблемы с зачислением платежа №" + values.event.eventval]}'
			},
			31: {
				any: '{[values.event.eventval.login]}'
					+ '<tpl if="values.event.eventval.firstname'
					+ ' && values.event.eventval.lastname">'
						+ ' ({[values.event.eventval.firstname]}'
						+ ' {[values.event.eventval.lastname]})'
					+ '</tpl>'

					+ '<tpl if="values.event.eventval.firstname'
					+ ' && !values.event.eventval.lastname">'
						+ ' ({[values.event.eventval.firstname]})'
					+ '</tpl>'

					+ '<tpl if="!values.event.eventval.firstname'
					+ ' && values.event.eventval.lastname">'
						+ ' ({[values.event.eventval.lastname]})'
					+ '</tpl>'
					+ ' &mdash; ' + 'вход в систему'
					+ ' ({[values.event.eventval.ip]})'
			},
			32: {
				any: '{[values.event.eventval.login]}'
					+ '<tpl if="values.event.eventval.firstname'
					+ ' && values.event.eventval.lastname">'
						+ ' ({[values.event.eventval.firstname]}'
						+ ' {[values.event.eventval.lastname]})'
					+ '</tpl>'

					+ '<tpl if="values.event.eventval.firstname'
					+ ' && !values.event.eventval.lastname">'
						+ ' ({[values.event.eventval.firstname]})'
					+ '</tpl>'

					+ '<tpl if="!values.event.eventval.firstname'
					+ ' && values.event.eventval.lastname">'
						+ ' ({[values.event.eventval.lastname]})'
					+ '</tpl>'
					+ ' &mdash; ' + 'выход из системы'
			}
		}
	},

	device: {
		tpl: {
			1: { //получение пакета данных
				any: 'Получен пакет данных'
			},
			5: {
				any: 'Устройство переименовано'
			},
			7: { //включение/отключение
				349: 'Устройство отключено',
				7488: 'Устройство включено'
			},
			20: {
				any: 'Устройство &mdash; связь восстановлена'
			},
			21: { //расшаривание
				denyall:
					'Доступ заперщен всем внешним пользователям',
				allowall:
					'Доступ разрешен всем внешним пользователям',
				allowselected:
					'Доступ разрешен пользователям из списка организаций'
			},
			22: { //удаление из всех групп
				0: 'Устройство ' +
					'удалено из всех групп'
			},
			/*23: { //добавление в группу
				any: 'Устройство ' +
					' включено в группу ' +
					'{[values.groupdevices.get(values.event.eventval).getName()]}'
			},*/
			24: { //Связь с устройством
				any: 'Устройство &mdash; связь потеряна'
			},
			28: { //уведомление
				any: '{[values.event.eventval]}'
			},
			29: { //тревога
				any: 'Тревога!'
			}
		}
	}
});
