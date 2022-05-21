/**
 * @fileOverview Панель параметра отчета типа Int
 *
 * @class O.reports.PeriodPanel
 * @extends Ext.panel.Panel
 */
C.define('O.reports.IntPanel', {
	extend: 'O.reports.SimplePanel',
	title: 'Parameter',
	fieldXType: 'numberfield',
	additionalParameters: {
		hideTrigger: true,
		allowDecimals: false,
		allowBlank: false
	}
});