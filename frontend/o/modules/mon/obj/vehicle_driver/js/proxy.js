/**
 * @class O.mon.proxy.vehicle.Driver
 * @extends O.proxy.Custom
 */
C.define('O.mon.proxy.vehicle.Driver', {
	extend: 'O.proxy.Custom',

/**
	* Proxy-object identifier
	* @type String
	*/
	id: 'mon_vehicle_driver',

/**
	* Preload text for current proxy
	* @type String
	*/
	preloadText: _('Vehicle drivers'),

/**
	* Need preload flag.
	* If true, then data is loaded before application starts
	* @type Boolean
	*/
	needPreload: false,

/**
	* Ext.data.Model name of a record in a proxy store
	* @type String
	*/
	model: 'Mon.vehicle.Driver',

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
	type: O.mon.model.vehicle.Driver
}, function() {
	this.prototype.superclass.register(this);
});