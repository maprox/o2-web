/**
 * @class O.mon.proxy.device.Command
 * @extends O.proxy.Custom
 */
C.define('O.mon.proxy.device.Command', {
	extend: 'O.proxy.Custom',

/**
	* Proxy-object identifier
	* @type String
	*/
	id: 'mon_device_command',

/**
	* Preload text for current proxy
	* @type String
	*/
	preloadText: _('Mon device command'),

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
	model: 'Mon.Device.Command',

/**
	* Rest controller on a backend
	* @type Boolean
	*/
	isRest: true,

/**
	 * Extra parameters
	 * @type Object
	 */
	extraParams: {
		'$joined': 1
	},

/**
	* Do not reload proxy after model update
	* @type Boolean
	*/
	dontReloadAfterUpdate: false,

/**
	* Object type in router storage
	* @type Object
	*/
	type: O.mon.model.device.Command
}, function() {
	this.prototype.superclass.register(this);
});