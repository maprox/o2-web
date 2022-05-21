/**
 * Packet proxy
 *
 * @class O.mon.proxy.Packet
 * @extends O.proxy.Custom
 */
C.define('O.mon.proxy.Packet', {
	extend: 'O.proxy.Custom',

/**
	* Proxy-object identifier
	* @type String
	*/
	id: 'mon_packet',

/**
	* Need preload flag.
	* If true, then data is loaded before application starts
	* @type Boolean
	*/
	needPreload: false,

	/**
	 * Subscribe for proxy update only if specified modules exists
	 * If empty always subscribe
	 * @type Array
	 */
	subscribeModules: ['map'],

/**
	* Rest controller on a backend
	* @type Boolean
	*/
	isRest: true
}, function() {
	this.prototype.superclass.register(this);
});