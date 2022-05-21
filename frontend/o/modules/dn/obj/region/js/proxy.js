/**
 * Region proxy object
 * @class O.proxy.dn.Region
 * @extends O.proxy.Custom
 */
C.define('O.proxy.dn.Region', {
	extend: 'O.proxy.Custom',

/**
	* Идентификатор прокси-объекта
	* @type String
	*/
	id: 'dn_region',

/**
	* Текст предзагрузки для прокси
	* @type String
	*/
	preloadText: 'Regions',
	needPreload: true,

	model: 'Dn.Region',

/**
	* Тип объектов в хранилище роутера
	* @type Object
	*/
	type: O.model.dn.Region
}, function() {
	this.prototype.superclass.register(this);
});