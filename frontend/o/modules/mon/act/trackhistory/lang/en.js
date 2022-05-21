/**
 *
 * EN
 *
 * There is no need in this file.
 * Keep it here for further translations.
 *
 */
C.utils.inherit('O.ui.module.TrackHistory', {
	textShort: 'Track history',
	textLong: 'Track history map'
});

C.utils.inherit('O.act.TrackHistory', {
	msgTrackHistory: 'Track history',
	lngEmptyPeriod: 'There are no data for selected period.'
});

C.utils.inherit('O.comp.DeviceHistory', {
	msgDeviceHistory: 'Detailed report',
	msgDeviceProperties: 'Properties',
	msgDeviceEvents: 'Events',
	deviceInfo_tpl_Name: 'Name',
	deviceInfo_tpl_Id: 'Identifier',
	deviceInfo_tpl_LastData: 'Last data',
	deviceInfo_tpl_DataLoadTime: 'Recieve time',
	deviceInfo_tpl_Speed: 'Speed',
	deviceInfo_tpl_Coord: 'Coordinates',
	deviceInfo_tpl_Place: 'Place',
	deviceInfo_tpl_NoData: 'No data'
});

C.utils.inherit('O.comp.DetailedReport', {
	lngMovingDescription: ['Stopping', 'Moving'],
	lngTitleEvent: 'Event',
	lngTitleBegin: 'Begin',
	lngTitleEnd: 'End',
	lngTitleDuration: 'Duration',
	lngTitleData: 'Data',
	lngTitleAddress: 'Address',
	lngAddressColumn: 'Not detected'
});

_({
	speedColumnTemplate: '<b>Speed</b>: {2}{0} (maximum: {2}{1}).',
	odometerColumnTemplate: '<b>Run</b>: {1}{0}km.<br />'
});

C.utils.inherit('O.comp.HistoryPanel', {
	msgBtnShowStoppings: 'Show all stoppings',
	msgBtnHideStoppings: 'Hide all stoppings',
	msgBtnHideAll: 'Uncheck all',
	msgTitle: 'Track history'
})
