/**
 *
 * Access Level proxy object
 * @class O.proxy.AccessLevel
 * @extends O.proxy.Custom
 */
C.define('O.proxy.AccessLevel', {
	extend: 'O.proxy.Custom',

/**
	* Идентификатор прокси-объекта
	* @type String
	*/
	id: 'accesslevels',

/**
	* Текст предзагрузки для прокси
	* @type String
	*/
	preloadText: 'Access levels',
	needPreload: false,

	model: 'AccessLevel',

/**
	* Тип объектов в хранилище роутера
	* @type Object
	*/
	type: O.model.AccessLevel
}, function() {
	this.prototype.superclass.register(this);
});