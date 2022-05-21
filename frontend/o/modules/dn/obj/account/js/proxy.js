/**
 *
 * Account proxy object
 * @class O.proxy.dn.Account
 * @extends O.proxy.Custom
 */
C.define('O.proxy.dn.Account', {
	extend: 'O.proxy.Custom',

/**
	* Идентификатор прокси-объекта
	* @type String
	*/
	id: 'dn_account',

/**
	* Текст предзагрузки для прокси
	* @type String
	*/
	preloadText: 'Accounts',
	needPreload: true,

	model: 'Dn.Account',

/**
	* Rest controller on a backend
	* @type Boolean
	*/
	isRest: true,

/**
	* Тип объектов в хранилище роутера
	* @type Object
	*/
	type: O.model.dn.Account
}, function() {
	this.prototype.superclass.register(this);
});