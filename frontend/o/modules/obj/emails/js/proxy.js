/**
 * @fileOverview Роутер списка почтовых адресов
 */

/**
 * Роутер почтовых адресов
 *
 * @class O.proxy.Email
 * @extends O.proxy.Custom
 */
C.define('O.proxy.Email', {
	extend: 'O.proxy.Custom',

/**
	* Идентификатор прокси-объекта
	* @type String
	*/
	id: 'emails',

	model: 'Email',
/**
	* Текст предзагрузки
	* @type String
	*/
	preloadText: 'Emails',

/**
	* Тип объектов в хранилище роутера
	* @type Object
	*/
	type: O.model.Email,
	needPreload: true
}, function() {
	this.prototype.superclass.register(this);
});