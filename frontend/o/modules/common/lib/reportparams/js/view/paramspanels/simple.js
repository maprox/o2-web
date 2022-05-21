/**
 * @fileOverview Панель абстрактного простого параметра отчета
 *
 * @class O.reports.SimplePanel
 * @extends Ext.panel.Panel
 */
C.define('O.reports.SimplePanel', {
	extend: 'Ext.panel.Panel',
	title: 'Simple Parameter',

	msgLabelText: 'Enabled',
	fieldXType: 'checkboxfield',
	//Дополнительные параметры поля ввода (поле не пустое, только цифры и т.д.)
	additionalParameters: {},

	initComponent: function() {
		Ext.apply(this, {
			padding: '5 5 5 5',
			title: _(this.title),
			height: this.height,
			layout: 'anchor',
			items: [{
				padding: '5 5 5 5',
				xtype: this.fieldXType,
				boxLabel: this.msgLabelText,
				anchor: '-10',
				border: true
			}]
		});
		this.callParent(arguments);
	}
});