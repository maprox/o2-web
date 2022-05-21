/**
 * Панель параметра отчета типа Bool
 * @class O.reports.StringPanel
 * @extends Ext.panel.Panel
 */
C.define('O.reports.BoolPanel', {
	extend: 'O.reports.SimplePanel',
	title: 'Bool parameter',

	msgLabelText: 'Enabled',
	fieldXType: 'checkboxfield',
	
	initComponent: function() {
		this.callParent(arguments);
		this.valid = true;
	}
});