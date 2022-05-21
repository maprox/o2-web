/**
 * @class O.mon.proxy.DeviceProtocol
 * @extends O.proxy.Custom
 */
C.define('O.mon.proxy.DeviceProtocol', {
	extend: 'O.proxy.Custom',

/**
	* Proxy-object identifier
	* @type String
	*/
	id: 'mon_device_protocol',

/**
	* Preload text for current proxy
	* @type String
	*/
	preloadText: _('Device protocols'),

/**
	* Need preload flag.
	* If true, then data is loaded before application starts
	* @type Boolean
	*/
	needPreload: true,

/**
	* Ext.data.Model name of a record in a proxy store
	* @type String
	*/
	model: 'Mon.DeviceProtocol',

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
	* Extra parameters
	* @type Object
	*/
	extraParams: {
		'$joined': 1
	},

/**
	* Object type in router storage
	* @type Object
	*/
	type: O.mon.model.DeviceProtocol
}, function() {
	this.prototype.superclass.register(this);
});