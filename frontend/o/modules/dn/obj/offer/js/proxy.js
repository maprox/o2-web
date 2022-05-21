/**
 *
 * Offer proxy object
 * @class O.proxy.dn.Offer
 * @extends O.proxy.Custom
 */
C.define('O.proxy.dn.Offer', {
	extend: 'O.proxy.Custom',

/**
	* Идентификатор прокси-объекта
	* @type String
	*/
	id: 'dn_offer',

/**
	* Текст предзагрузки для прокси
	* @type String
	*/
	preloadText: 'Offers',
	needPreload: true,

	model: 'Dn.Offer',

/**
	* Rest controller on a backend
	* @type Boolean
	*/
	isRest: true,

	/**
	* Do not reload proxy after model update
	* @type Boolean
	*/
	dontReloadAfterUpdate: false,

/**
	* Тип объектов в хранилище роутера
	* @type Object
	*/
	type: O.model.dn.Offer
}, function() {
	this.prototype.superclass.register(this);
});