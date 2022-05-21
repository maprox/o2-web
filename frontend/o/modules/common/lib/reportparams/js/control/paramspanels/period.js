/**
 * @fileOverview Панель параметра отчета типа "временной период"
 *
 * @class O.reports.PeriodPanel
 * @extends Ext.panel.Panel
 */
C.utils.inherit('O.reports.PeriodPanel', {
/**
	* Component initialization
	* @constructs
	*/
	initComponent: function() {
		this.callOverridden();
		this.down('periodchooser').on('periodChange', this.onPeriodChange, this);
		this.addEvents('validityChange');
	},

	/**
	 * При изменении выбранного периода вызываем проверку всех полей
	 */
	onPeriodChange: function() {
		this.fireEvent('validityChange');
	},

	/**
	 * Возвращает выбранное значение промежутка
	 * @return {Object}
	 */
	getValue: function() {
		if (this.paramName === undefined) return null;
		return {
			paramName: this.paramName,
			paramValue: this.down('periodchooser').getPeriod()
		}
	},

	/**
	 * Анализируем валидность заполнения поля
	 */
	isValid: function() {
		return (this.down('periodchooser').getPeriod(false) != null);
	}
});