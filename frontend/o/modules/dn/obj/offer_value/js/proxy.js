/**
 * OfferValue proxy object
 * @class O.proxy.dn.OfferValue
 * @extends O.proxy.Custom
 */
C.define('O.proxy.dn.OfferValue', {
	extend: 'O.proxy.Custom',

/**
	* Идентификатор прокси-объекта
	* @type String
	*/
	id: 'dn_offer_value',

/**
	* Текст предзагрузки для прокси
	* @type String
	*/
	preloadText: 'Offers',
	needPreload: false,

	model: 'Dn.OfferValue',

/**
	* Rest controller on a backend
	* @type Boolean
	*/
	isRest: true,

/**
	* Тип объектов в хранилище роутера
	* @type Object
	*/
	type: Dn.OfferValue
}, function() {
	this.prototype.superclass.register(this);
});