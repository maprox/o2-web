/**
 *
 * RU
 *
 */
C.utils.inherit('M.lib.periodchooser.Toolbar', {
	msgPeriodFrom: 'Период с ',
	msgPeriodTo: 'по',
	msgPresets: {
		TODAY: {
			text: 'Сегодня',
			tooltip: 'Данные за сегодня'
		},
		YESTERDAY: {
			text: 'Вчера',
			tooltip: 'Данные за вчера'
		},
		TWODAYS: {
			text: '2 дня',
			tooltip: 'Данные за два дня'
		},
		WEEK: {
			text: 'Неделя',
			tooltip: 'Данные за текущую неделю'
		},
		TENDAYS: {
			text: '10 дней',
			tooltip: 'Данные за последние десять дней'
		},
		MONTH: {
			text: 'Месяц',
			tooltip: 'Данные за текущий месяц'
		},
		PREVMONTH: {
			text: 'Предыдущий месяц',
			tooltip: 'Данные за предыдущий месяц'
		},
		YEAR: {
			text: 'Год',
			tooltip: 'Данные за текущий год'
		},
		CUSTOM: {
			text: 'Как указано:',
			tooltip: 'Выбранный пользователем период'
		}
	}
});