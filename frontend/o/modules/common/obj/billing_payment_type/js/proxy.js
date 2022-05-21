/**
 *
 * Payment type proxy object
 * @class O.proxy.billing.payment.Type
 * @extends O.proxy.Custom
 */
C.define('O.proxy.billing.payment.Type', {
	extend: 'O.proxy.Custom',

/**
	* Идентификатор прокси-объекта
	* @type String
	*/
	id: 'billing_payment_type',

/**
	* Текст предзагрузки для прокси
	* @type String
	*/
	preloadText: 'Payment types',
	needPreload: true, // Can't be false

	model: 'Billing.payment.Type',

/**
	* Тип объектов в хранилище роутера
	* @type Object
	*/
	type: O.model.billing.payment.Type
}, function() {
	this.prototype.superclass.register(this);
});