/**
 *
 * EN
 *
 * There is no need in this file.
 * Keep it here for further translations.
 *
 */
C.utils.inherit('O.ui.module.Settings', {
	textShort: 'Settings',
	textLong: 'User settings'
});

C.utils.inherit('O.settings.Panel', {
	title: 'Settings',
	msgSetSave: 'Save',
	msgSetCancel: 'Reset',
	msgSettingsSaved: 'Settings saved successfully'
});

C.utils.inherit('O.comp.settings.personal.Base', {
	title: 'Personal settings',
	tabTip: 'Editing of personal settings',
	msgBase: 'Base settings',
	msgPersonal: 'Personal settings',
	msgUILanguage: 'Language',
	msgTimeZone: 'Time zone',
	msgSyncPeriod: 'Sync time',
	msgEmail: 'E-mail',
	msgFirstName: 'First name',
	msgSecondName: 'Second name',
	msgLastName: 'Last name'
});

C.utils.inherit('O.comp.settings.map.Base', {
	title: 'Map',
	tabTip: 'Editing of map settings',
	msgDeviceBase: 'Device drawing settings',
	msgDeviceLabels: 'Device label settings',
	msgLabelPosition: 'Position',
	msgLabelRow1: 'First row',
	msgLabelRow2: 'Second row',
	msgLabelRow3: 'Third row',
	msgDeviceHistory: 'Device history settings',
	msgEventsPeriod: 'Show events for last'
});

C.utils.inherit('O.comp.settings.notification.Base', {
	title: 'Notification settings',
	tabTip: 'Editing means of notification',
	colActive: 'Active',
	colType: 'Notification type',
	colAddress: 'Address',
	colInformation: 'Information',
	colMedium: 'Medium',
	colHigh: 'High',
	colCritical: 'Critical',
	msgCreate: 'New notification means',
	msgDelete: 'Delete notification means',
	msgEdit: 'Edit notification means',
	msgConfirmation: 'Confirmation',
	msgAskDelete: 'Do you really want to delete selected notification means?',
	msgUnknownType: 'Incorrect messaging type',
	msgIncorrectEmail: 'Incorrect email',
	msgIncorrectPhone: 'Incorrect phone'
});

C.utils.inherit('O.comp.settings.Welcome', {
	title: 'Welcome text',
	tabTip: 'Editing of welcome text',
	msgWelcomeText: 'Welcome text'
});

Ext.data.StoreManager.lookup('deviceLabelPositionsStore').loadData([
	{ id: 1, position: 'Left' },
	{ id: 2, position: 'Right' },
	{ id: 3, position: 'Top' },
	{ id: 4, position: 'Bottom' }
]);

Ext.data.StoreManager.lookup('eventsPeriodsStore').loadData([
	{ value: 1, text: 'For a hour' },
	{ value: 12, text: 'For 12 hours' },
	{ value: 24, text: 'For 24 hours' },
	{ value: 48, text: 'For 2 days' },
	{ value: 168, text: 'For a week' }
]);
