/**
 * Event proxy
 *
 * @class O.proxy.Event
 * @extends O.proxy.Custom
 */
C.define('O.proxy.Event', {
	extend: 'O.proxy.Custom',

/**
	* Идентификатор прокси-объекта
	* @type String
	*/
	id: 'events',

	model: 'Event',

	needPreload: false,
/**
	* Текст предзагрузки
	* @type String
	*/
	preloadText: 'Events',

/**
	* Тип объектов в хранилище роутера
	* @type Object
	*/
	type: O.model.Event
}, function() {
	this.prototype.superclass.register(this);
});