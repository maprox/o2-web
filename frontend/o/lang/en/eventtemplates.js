/**
 *
 * EN
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
				any: 'Device ' +
					'{[this.getName(values.devices.get(values.event.ownerid))]}' +
					' - data packet recieved'
			},
			5: {
				any: 'Device ' +
					'{[this.getName(values.devices.get(values.event.ownerid))]} was renamed'
			},
			7: { //включение/отключение
				349: 'Device ' +
					' {[this.getName(values.devices.get(values.event.ownerid))]} is disabled',
				7488: 'Device ' +
					' {[this.getName(values.devices.get(values.event.ownerid))]} is enabled'
			},
			18: {
				any: 'Login ({[Ext.JSON.decode(values.event.eventval).ip]})'
			},
			19: {
				any: 'Logout'
			},
			20: {
				any: 'Device ' +
					'{[this.getName(values.devices.get(values.event.ownerid))]} is connected'
			},
			21: { //расшаривание
				denyall:
					'Access to {[this.getName(values.devices.get(values.event.ownerid))]}' +
					' was denied for all foreign users',
				allowall:
					'Access to {[this.getName(values.devices.get(values.event.ownerid))]}' +
					' was granted for all foreign users',
				allowselected:
					'Access to {[this.getName(values.devices.get(values.event.ownerid))]} ' +
					'was granted for list of selected users'
			},
			22: { //удаление из всех групп
				0: 'Device ' +
					' {[this.getName(values.devices.get(values.event.ownerid))]} ' +
					' was removed from all groups'
			},
			23: { //добавление в группу
				any: 'Device ' +
					' {[this.getName(values.devices.get(values.event.ownerid))]} ' +
					' was attached to group ' +
					'{[this.getName(values.groupdevices.get(values.event.eventval))]}'
			},
			24: { //Связь с устройством
				any: 'Device ' +
					' {[this.getName(values.devices.get(values.event.ownerid))]} is lost'
			},
			28: { //уведомление
				any: '{[values.event.eventval]}'
			},
			29: { //тревога
				any: 'Device ' +
					' {[this.getName(values.devices.get(values.event.ownerid))]} ' +
					' have sent emergency signal!'
			},
			30: { //ошибка в платеже
				any: '{[values.event.eventval ? '+
					'"Problem with recieving billing invoice" : ' +
					'"Problem with recieving billing invoice №" + values.event.eventval]}'
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
					+ ' &mdash; ' + 'login'
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
					+ ' &mdash; ' + 'logout'
			}
		}
	},

	device: {
		tpl: {
			1: { //получение пакета данных
				any: 'Data packet recieved'
			},
			5: {
				any: 'Device was renamed'
			},
			7: { //включение/отключение
				349: 'Device is disabled',
				7488: 'Device is enabled'
			},
			20: {
				any: 'Device is connected'
			},
			21: { //расшаривание
				denyall:
					'Access was denied for all foreign users',
				allowall:
					'Access was granted for all foreign users',
				allowselected:
					'Access was granted for list of selected users'
			},
			22: { //удаление из всех групп
				0: 'Device ' +
					'was removed from all groups'
			},
			23: { //добавление в группу
				any: 'Device ' +
					' was attached to group ' +
					'{[values.groupdevices.get(values.event.eventval).getName()]}'
			},
			24: { //Связь с устройством
				any: 'Device is lost'
			},
			29: { //тревога
				any: 'Emergency!'
			}
		}
	}
});
