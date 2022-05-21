/**
 * Dummy packets proxy
 *
 * @deprecated
 * @class O.proxy.Event
 * @extends O.proxy.Custom
 */
C.define('O.proxy.Packet', {
	extend: 'O.proxy.Custom',

/**
	* Идентификатор прокси-объекта
	* @type String
	*/
	id: 'mon_packet',

	isRest: true,

	needPreload: false

}, function() {
	this.prototype.superclass.register(this);
});