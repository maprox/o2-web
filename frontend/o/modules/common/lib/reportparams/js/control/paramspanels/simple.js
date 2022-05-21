/**
 * @fileOverview Панель абстрактного простого параметра отчета
 *
 * @class O.reports.SimplePanel
 * @extends Ext.panel.Panel
 */
C.utils.inherit('O.reports.SimplePanel', {
/**
	* Component initialization
	*/
	initComponent: function() {
		this.callOverridden(arguments);
		if (this.defaultValue) {
			var field = this.down(this.fieldXType);
			if (field) {
				field.setValue(this.defaultValue);
			}
		}
		this.items.items[0].on('change', 'itemChange', this);
		Ext.apply(this.items.items[0], this.additionalParameters);
		this.valid = false;
	},

/**
	 * Возвращает заданное значение
	 * @return {Object}
	 */
	getValue: function() {
		if (this.paramName === undefined) { return null; }
		return {
			paramName: this.paramName,
			paramValue: this.down(this.fieldXType).getValue()
		}
	},

	/*
	 * Возвращает корректность заполненности поля
	 */
	isValid: function() {
		return this.valid;
	},

	/*
	 * Анализируем валидность заполнения поля
	 */
	itemChange: function() {
		if (this.items.items[0].isValid !== undefined) {
			var oldValid = this.valid;
			this.valid = this.items.items[0].isValid();
			if (oldValid != this.valid) {
				this.fireEvent('validityChange');
			}
		}
	}
});