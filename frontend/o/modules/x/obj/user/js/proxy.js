/**
 *
 * Right proxy object
 * @class O.proxy.x.User
 * @extends O.proxy.Custom
 */
C.define('O.proxy.x.User', {
	extend: 'O.proxy.Custom',

/**
	* Идентификатор прокси-объекта
	* @type String
	*/
	id: 'x_user',

/**
	* Текст предзагрузки для прокси
	* @type String
	*/
	preloadText: 'Users',
	needPreload: true, // Can't be false

	model: 'X.User',
	isRest: true,

/**
	* Тип объектов в хранилище роутера
	* @type Object
	*/
	type: O.x.model.User
}, function() {
	this.prototype.superclass.register(this);
});
