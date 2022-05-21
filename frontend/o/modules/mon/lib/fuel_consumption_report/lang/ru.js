/**
 *
 * RU
 *
 */
_({
	'Vehicle registration identifier': 'Регистрационный номер ТС',
	'Vehicle name': 'Модель ТС',
	'Division': 'Подразделение',
	'Series': 'Серия',
	'Type': 'Тип',
	'No waylists': 'Нет путевых листов',
	'Create consumption report': 'Создать отчет',
	'Create report': 'Создать отчет',
	'Fuel consumption report editor': 'Редактор отчета о расходе ГСМ',
	'Please, fill properties and save the report':
		'Пожалуйста, заполните свойства отчета и сохраните его',
	'Vehicles': 'Транспорт',
	'Car model': 'Марка транспорта',
	'License number': 'Гос. номер',
	'Responsible for the operation': 'Ответственный за эксплуатацию',
	'Consumption rate': 'Установленная норма расхода',
	'Consumption limit': 'Установленный лимит расхода на отчетный период',
	'Waylist mileage': 'Пробег по путевым листам (км)',
	'Maprox mileage': 'Пробег по MAPROX',
	'Consumption by norm': 'Расход по норме',
	'Actual consumption': 'Фактический расход',
	'Previous month remainder': 'Остаток прошлого месяца',
	'Received': 'Получено',
	'Next month remainder': 'Остаток к нач. след. месяца',
	'Overrun': 'Перерасход',
	'Report of this date already exists': 'Отчет на эту дату уже существует',
	'You need to specify division': 'Вам необходимо указать подразделение',
	'You need to specify date': 'Необходимо указать дату отчета',
	'Not specified': 'Не указано'
});

C.utils.inherit('O.mon.act.fuel_consumption_report.Module', {
	textShort: _('Отчет о расходе ГСМ'),
	textLong: _('Редактор отчетов о расходе ГСМ')
});