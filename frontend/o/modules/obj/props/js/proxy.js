/**
 * @fileOverview Роутер списка свойств пакетов
 */

/**
 * Роутер свойств пакетов
 *
 * @class O.proxy.Prop
 * @extends O.proxy.Custom
 */
C.define('O.proxy.Prop', {
	extend: 'O.proxy.Custom',

/**
	* Идентификатор прокси-объекта
	* @type String
	*/
	id: 'props',

	model: 'Props',
/**
	* Текст предзагрузки
	* @type String
	*/
	preloadText: 'Packets properties',

/**
	* Тип объектов в хранилище роутера
	* @type Object
	*/
	type: O.model.Prop,
	needPreload: true
}, function() {
	this.prototype.superclass.register(this);
});