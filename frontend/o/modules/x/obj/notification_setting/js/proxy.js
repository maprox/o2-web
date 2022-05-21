/**
 *
 * Measure proxy object
 * @class O.proxy.dn.Measure
 * @extends O.proxy.Custom
 */
C.define('O.proxy.x.notification.Setting', {
	extend: 'O.proxy.Custom',

/**
	* Идентификатор прокси-объекта
	* @type String
	*/
	id: 'x_notification_setting',

/**
	* Текст предзагрузки для прокси
	* @type String
	*/
	preloadText: 'Notification settings',
	needPreload: true, // Can't be false

	model: 'X.Notification.Setting',

/**
	* Тип объектов в хранилище роутера
	* @type Object
	*/
	type: O.x.model.notification.Setting
}, function() {
	this.prototype.superclass.register(this);
});
