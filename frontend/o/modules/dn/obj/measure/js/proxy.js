/**
 *
 * Measure proxy object
 * @class O.proxy.dn.Measure
 * @extends O.proxy.Custom
 */
C.define('O.proxy.dn.Measure', {
	extend: 'O.proxy.Custom',

/**
	* Идентификатор прокси-объекта
	* @type String
	*/
	id: 'dn_measure',

/**
	* Текст предзагрузки для прокси
	* @type String
	*/
	preloadText: 'Measures',
	needPreload: true,

	model: 'Dn.Measure',

/**
	* Тип объектов в хранилище роутера
	* @type Object
	*/
	type: O.model.dn.Measure
}, function() {
	this.prototype.superclass.register(this);
});