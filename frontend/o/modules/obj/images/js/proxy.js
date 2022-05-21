/**
 * @fileOverview Роутер списка изображений
 */

/**
 * Роутер изображений
 *
 * @class O.proxy.Image
 * @extends O.proxy.Custom
 */
C.define('O.proxy.Image', {
	extend: 'O.proxy.Custom',

/**
	* Идентификатор прокси-объекта
	* @type String
	*/
	id: 'images',

	model: 'Images',
/**
	* Текст предзагрузки
	* @type String
	*/
	preloadText: 'Images',

/**
	* Тип объектов в хранилище роутера
	* @type Object
	*/
	type: O.model.Image,
	needPreload: true // Can't be false
}, function() {
	this.prototype.superclass.register(this);
});