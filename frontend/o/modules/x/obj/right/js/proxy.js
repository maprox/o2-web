/**
 *
 * Right proxy object
 * @class O.proxy.x.Right
 * @extends O.proxy.Custom
 */
C.define('O.proxy.x.Right', {
	extend: 'O.proxy.Custom',

/**
	* Идентификатор прокси-объекта
	* @type String
	*/
	id: 'x_right',

/**
	* Текст предзагрузки для прокси
	* @type String
	*/
	preloadText: 'Rights',
	needPreload: true, // Can't be false

	model: 'X.Right',
	isRest: true,

/**
	* Тип объектов в хранилище роутера
	* @type Object
	*/
	type: O.x.model.Right
}, function() {
	this.prototype.superclass.register(this);
});
