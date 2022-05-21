/**
 */
/**
 * Реализация менеджера кеша, который хранит куки с определенным префиксом
 * @class O.state.CookieProvider
 * @extends Ext.state.CookieProvider
 */
Ext.define('O.state.CookieProvider', {
	extend: 'Ext.state.CookieProvider',

/**
	* Префикс переменных, которые будут хранится в куках
	* @type String
	*/
	prefix: '',

/**
	* Получение значения параметра
	* @param {String} name Имя параметра
	* @param {Object} defaultValue Значение параметра по-умолчанию
	*/
	get: function(name, defaultValue) {
		return O.state.CookieProvider.superclass.get.call(this,
			this.prefix + name, defaultValue);
	},

/**
	* Установка значения параметра
	* @param {String} name Имя параметра
	* @param {Object} value Значение параметра
	*/
	set: function(name, value) {
		return O.state.CookieProvider.superclass.set.call(this,
			this.prefix + name, value);
	}
});
