/**
 *
 * Measure proxy object
 * @class O.proxy.dn.Measure
 * @extends O.proxy.Custom
 */
C.define('O.proxy.x.notification.setting.Type', {
	extend: 'O.proxy.Custom',

/**
	* Идентификатор прокси-объекта
	* @type String
	*/
	id: 'x_notification_setting_type',

/**
	* Текст предзагрузки для прокси
	* @type String
	*/
	preloadText: 'Notification settings types',
	needPreload: true, // Can't be false

	model: 'X.Notification.Setting.Type',

/**
	* Тип объектов в хранилище роутера
	* @type Object
	*/
	type: O.x.model.notification.setting.Type
}, function() {
	this.prototype.superclass.register(this);
});
