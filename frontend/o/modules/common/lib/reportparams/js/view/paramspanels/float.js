/**
 * @fileOverview Панель параметра отчета типа Float
 *
 * @class O.reports.PeriodPanel
 * @extends Ext.panel.Panel
 */
C.define('O.reports.FloatPanel', {
	extend: 'O.reports.SimplePanel',
	title: 'Float parameter',
	fieldXType: 'numberfield',
	additionalParameters: {
		hideTrigger: true,
		allowDecimals: true,
		allowBlank: false
	}
});