/**
 * @class O.mon.proxy.DeviceImage
 * @extends O.proxy.Custom
 */
C.define('O.mon.proxy.DeviceImage', {
	extend: 'O.proxy.Custom',

/**
	* Proxy-object identifier
	* @type String
	*/
	id: 'mon_device_image',

/**
	* Preload text for current proxy
	* @type String
	*/
	preloadText: _('Device images'),

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
	model: 'Mon.DeviceImage',

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
	type: O.mon.model.DeviceImage
}, function() {
	this.prototype.superclass.register(this);
});