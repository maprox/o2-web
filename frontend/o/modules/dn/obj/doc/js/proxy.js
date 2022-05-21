/**
 *
 * Doc proxy object
 * @class O.proxy.dn.Doc
 * @extends O.proxy.Custom
 */
C.define('O.proxy.dn.Doc', {
	extend: 'O.proxy.Custom',

/**
	* Идентификатор прокси-объекта
	* @type String
	*/
	id: 'dn_doc',

/**
	* Текст предзагрузки для прокси
	* @type String
	*/
	preloadText: 'Documents',
	needPreload: true,

	model: 'Dn.Doc',

/**
	* Тип объектов в хранилище роутера
	* @type Object
	*/
	type: O.model.dn.Doc
}, function() {
	this.prototype.superclass.register(this);
});