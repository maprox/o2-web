/**
 * @fileOverview Панель параметра отчета типа String
 *
 * @class O.reports.StringPanel
 * @extends Ext.panel.Panel
 */
C.define('O.reports.StringPanel', {
	extend: 'O.reports.SimplePanel',
	title: 'String parameter',
	fieldXType: 'htmleditor',
	height: 168,
	additionalParameters: {
		anchor: '100%',
		padding: '0 0 0 0'
	},
	
	/*
	 * Возвращает корректность заполненности поля
	 */
	isValid: function() {
		return true;
	},

	/*
	 * Не анализируем валидность заполнения поля, т.к. строка
	 * в общем случае м.б. пустой
	 */
	itemChange: function() {
	}
});