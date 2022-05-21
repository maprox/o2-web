/**
 *
 * Account proxy object
 * @class O.proxy.billing.Account
 * @extends O.proxy.Custom
 */
C.define('O.proxy.billing.Account', {
	extend: 'O.proxy.Custom',

/**
	* Идентификатор прокси-объекта
	* @type String
	*/
	id: 'billing_account',

/**
	* Текст предзагрузки для прокси
	* @type String
	*/
	preloadText: 'Accounts',
	needPreload: false,

	model: 'Billing.Account',

/**
	* Тип объектов в хранилище роутера
	* @type Object
	*/
	type: O.model.billing.Account
}, function() {
	this.prototype.superclass.register(this);
});