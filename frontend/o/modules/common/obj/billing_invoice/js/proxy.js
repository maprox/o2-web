/**
 * Billing invoice proxy
 * (Just a proxy for loader)
 *
 * @class O.proxy.billing.Invoice
 * @extends O.proxy.Custom
 */
C.define('O.proxy.billing.Invoice', {
	extend: 'O.proxy.Custom',

/**
	* Идентификатор прокси-объекта
	* @type String
	*/
	id: 'billing_invoice',

	needPreload: false,

/**
	* Текст предзагрузки
	* @type String
	*/
	preloadText: 'Billing invoice'

}, function() {
	this.prototype.superclass.register(this);
});