/**
 *
 * Offer proxy object
 * @class O.proxy.dn.Requiredvolume
 * @extends O.proxy.Custom
 */
C.define('O.proxy.dn.Requiredvolume', {
	extend: 'O.proxy.Custom',

/**
	* Идентификатор прокси-объекта
	* @type String
	*/
	id: 'dn_requiredvolume',

/**
	* Текст предзагрузки для прокси
	* @type String
	*/
	preloadText: 'Requiredvolumes',
	needPreload: true,

	model: 'Dn.Requiredvolume',

/**
	* Тип объектов в хранилище роутера
	* @type Object
	*/
	type: O.model.dn.Requiredvolume
}, function() {
	this.prototype.superclass.register(this);
});