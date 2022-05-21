/**
 * OfferValue proxy object
 * @class O.proxy.dn.RequiredvolumeValue
 * @extends O.proxy.Custom
 */
C.define('O.proxy.dn.RequiredvolumeValue', {
	extend: 'O.proxy.Custom',

/**
	* Идентификатор прокси-объекта
	* @type String
	*/
	id: 'dn_requiredvolume_value',

/**
	* Текст предзагрузки для прокси
	* @type String
	*/
	preloadText: 'Requiredvolumes',
	needPreload: true,

	model: 'Dn.RequiredvolumeValue',

/**
	* Тип объектов в хранилище роутера
	* @type Object
	*/
	type: O.model.dn.RequiredvolumeValue
}, function() {
	this.prototype.superclass.register(this);
});