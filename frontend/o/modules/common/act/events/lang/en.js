/**
 *
 * EN
 *
 * There is no need in this file.
 * Keep it here for further translations.
 * 
 */
C.utils.inherit('O.ui.module.Events', {
	textShort: 'Events',
	textLong: 'List of system events'
});

C.utils.inherit('O.common.act.events.Panel', {
	evLoad: 'Load',
	evEventsPeriodFrom: 'Events for the period from',
	evEventsPeriodTo: 'to',
	evPresets: {
		today: {
			text: 'For today',
			tooltip: ''
		},
		week: {
			text: 'For a week',
			tooltip: 'Events for the past seven days'
		},
		month: {
			text: 'For a month',
			tooltip: ''
		}
	}
});