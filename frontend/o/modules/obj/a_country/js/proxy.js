/**
 *
 * Countries proxy object
 * @class O.proxy.a.Country
 * @extends O.proxy.Custom
 */
C.define('O.proxy.a.Country', {
	extend: 'O.proxy.Custom',

/**
	* Идентификатор прокси-объекта
	* @type String
	*/
	id: 'a_country',

/**
	* Текст предзагрузки для прокси
	* @type String
	*/
	preloadText: 'Countries',
	needPreload: false,

	model: 'A.Country',

/**
	* Тип объектов в хранилище роутера
	* @type Object
	*/
	type: O.model.a.Country
}, function() {
	this.prototype.superclass.register(this);
});
