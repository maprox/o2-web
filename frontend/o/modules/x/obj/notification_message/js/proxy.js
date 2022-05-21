/**
 *
 * Default notification messages
 * @class O.proxy.x.notification.Message
 * @extends O.proxy.Custom
 */
C.define('O.proxy.x.notification.Message', {
	extend: 'O.proxy.Custom',

/**
	* Идентификатор прокси-объекта
	* @type String
	*/
	id: 'x_notification_message',

/**
	* Текст предзагрузки для прокси
	* @type String
	*/
	preloadText: 'Notification settings types',
	needPreload: true, // Can't be false

	model: 'X.Notification.Message',

/**
	* Тип объектов в хранилище роутера
	* @type Object
	*/
	type: O.x.model.notification.Message
}, function() {
	this.prototype.superclass.register(this);
});
