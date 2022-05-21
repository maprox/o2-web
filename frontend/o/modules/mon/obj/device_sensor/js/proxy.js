/**
 * Monitoring device sensor object
 * @class O.mon.proxy.DeviceSensor
 * @extends O.proxy.Custom
 */
C.define('O.mon.proxy.DeviceSensor', {
	extend: 'O.proxy.Custom',

/**
	* Proxy-object identifier
	* @type String
	*/
	id: 'mon_device_sensor',

/**
	* Preload text for current proxy
	* @type String
	*/
	preloadText: _('Device sensors'),

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
	model: 'Mon.DeviceSensor',

/**
	* Rest controller on a backend
	* @type Boolean
	*/
	isRest: true,

/**
	* Do not reload proxy after model update
	* @type Boolean
	*/
	dontReloadAfterUpdate: true,

/**
	* Object type in router storage
	* @type Object
	*/
	type: O.mon.model.DeviceSensor
}, function() {
	this.prototype.superclass.register(this);
});