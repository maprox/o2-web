/**
 * @fileOverview Панель параметров отчета
 *
 * @class O.reports.Params
 * @extends Ext.panel.Panel
 */

C.define('O.reports.Params', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.reportparams',

	lngTitleNull: 'Parameter',
	lngTitleName: 'Name',
	lngTitlePeriod: 'Period',
	lngTitleDevice: 'Devices',
	lngTitleCount: 'Count',

	autoScroll: true,
	autoDestroy: false,
	layout: {
		type: 'anchor',
		align: 'stretch'
	}
});