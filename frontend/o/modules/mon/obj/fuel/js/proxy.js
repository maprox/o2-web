/**
 * @class O.mon.proxy.Fuel
 * @extends O.proxy.Custom
 */
C.define('O.mon.proxy.Fuel', {
	extend: 'O.proxy.Custom',

/**
	* Proxy-object identifier
	* @type String
	*/
	id: 'mon_fuel',

/**
	* Preload text for current proxy
	* @type String
	*/
	preloadText: _('Firm fuel'),

/**
	* Need preload flag.
	* If true, then data is loaded before application starts
	* @type Boolean
	*/
	needPreload: true, // Can't be false

/**
	* Ext.data.Model name of a record in a proxy store
	* @type String
	*/
	model: 'Mon.Fuel',

/**
	* Rest controller on a backend
	* @type Boolean
	*/
	isRest: true,

/**
	* Do not reload proxy after model update
	* @type Boolean
	*/
	dontReloadAfterUpdate: false,

/**
	* Object type in router storage
	* @type Object
	*/
	type: O.mon.model.Fuel
}, function() {
	this.prototype.superclass.register(this);
});