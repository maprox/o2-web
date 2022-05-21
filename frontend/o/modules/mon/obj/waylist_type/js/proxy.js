/**
 *
 * Measure proxy object
 * @class O.proxy.mon.waylist.Type
 * @extends O.proxy.Custom
 */
C.define('O.proxy.mon.waylist.Type', {
	extend: 'O.proxy.Custom',

/**
	* Идентификатор прокси-объекта
	* @type String
	*/
	id: 'mon_waylist_type',

/**
	* Текст предзагрузки для прокси
	* @type String
	*/
	preloadText: 'Waylist types',
	needPreload: true,

	model: 'Mon.Waylist.Type',

/**
	* Тип объектов в хранилище роутера
	* @type Object
	*/
	type: O.mon.model.waylist.Type
}, function() {
	this.prototype.superclass.register(this);
});
