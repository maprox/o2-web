/**
 *
 * Tariffs proxy object
 * @class O.proxy.Tariff
 * @extends O.proxy.Custom
 */
C.define('O.proxy.Tariff', {
	extend: 'O.proxy.Custom',

/**
	* Идентификатор прокси-объекта
	* @type String
	*/
	id: 'tariffs',

/**
	* Текст предзагрузки для прокси
	* @type String
	*/
	preloadText: 'Tariffs',
	needPreload: false,

	model: 'Tariff',

/**
	* Тип объектов в хранилище роутера
	* @type Object
	*/
	type: O.model.Tariff
}, function() {
	this.prototype.superclass.register(this);
});