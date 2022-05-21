/**
 * @class O.mon.proxy.fuel.consumption.report.Item
 * @extends O.proxy.Custom
 */
C.define('O.mon.proxy.device.sensor.history.Setting', {
	extend: 'O.proxy.Custom',

/**
	* Proxy-object identifier
	* @type String
	*/
	id: 'mon_device_sensor_history_setting',

/**
	* Preload text for current proxy
	* @type String
	*/
	preloadText: _('Mon device sensor history setting'),

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
	model: 'Mon.Device.Sensor.History.Setting',

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
	type: O.mon.model.device.sensor.history.Setting
}, function() {
	this.prototype.superclass.register(this);
});