/**
 * @fileOverview Панель параметра отчета типа Date
 *
 * @class O.reports.StringPanel
 * @extends Ext.panel.Panel
 */
C.define('O.reports.DatePanel', {
	extend: 'O.reports.SimplePanel',
	title: 'Date parameter',
	fieldXType: 'datefield',
	additionalParameters: {
		allowBlank: false
	}
});