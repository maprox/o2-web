/**
 * @fileOverview Роутер списка почтовых адресов
 */

/**
 * Роутер телефонных номеров
 *
 * @class O.proxy.Phone
 * @extends O.proxy.Custom
 */
C.define('O.proxy.Phone', {
	extend: 'O.proxy.Custom',

/**
	* Идентификатор прокси-объекта
	* @type String
	*/
	id: 'phones',

	model: 'Phone',
/**
	* Текст предзагрузки
	* @type String
	*/
	preloadText: 'Phones',

/**
	* Тип объектов в хранилище роутера
	* @type Object
	*/
	type: O.model.Phone,
	needPreload: true
}, function() {
	this.prototype.superclass.register(this);
});