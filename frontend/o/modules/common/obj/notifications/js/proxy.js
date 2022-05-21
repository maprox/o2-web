/**
 *
 * Notifications proxy object
 * @class O.proxy.Notification
 * @extends O.proxy.Custom
 */
C.define('O.proxy.Notification', {
	extend: 'O.proxy.Custom',

/**
	* Идентификатор прокси-объекта
	* @type String
	*/
	id: 'notifications',

/**
	* Текст предзагрузки для прокси
	* @type String
	*/
	preloadText: 'Notifications',
	needPreload: true,

	model: 'Notification',

/**
	* Тип объектов в хранилище роутера
	* @type Object
	*/
	type: O.model.Notification
}, function() {
	this.prototype.superclass.register(this);
});