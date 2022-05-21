/**
 * @fileOverview Роутер списка пакета документов
 *
 * @class O.proxy.GroupReports
 * @extends O.proxy.Custom
 */
C.define('O.proxy.GroupReports', {
	extend: 'O.proxy.Custom',

/**
	* Идентификатор прокси-объекта
	* @type String
	*/
	id: 'groupreports',

/**
	* Name of an Ext.data.Model class
	* @type String
	*/
	model: 'GroupReports',

/**
	* Текст предзагрузки
	* @type String
	*/
	preloadText: 'Groups of reports',
	needPreload: true,

	model: 'GroupReports',

/**
	* Тип объектов в хранилище роутера
	* @type Object
	*/
	type: O.model.GroupReports
}, function() {
	this.prototype.superclass.register(this);
});