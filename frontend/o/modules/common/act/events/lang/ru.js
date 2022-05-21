/**
 *
 * RU
 * 
 */
C.utils.inherit('O.ui.module.Events', {
	textShort: 'События',
	textLong: 'Окно событий системы'
});

C.utils.inherit('O.common.act.events.Panel', {
	evLoad: 'Загрузить',
	evEventsPeriodFrom: 'События за период с',
	evEventsPeriodTo: 'по',
	evPresets: {
		today: {
			text: 'За сегодня',
			tooltip: ''
		},
		week: {
			text: 'За неделю',
			tooltip: 'Вывод событий за прошедшие семь дней'
		},
		month: {
			text: 'За текущий месяц',
			tooltip: ''
		}
	}
});