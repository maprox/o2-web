/**
 * @class O.mon.proxy.fuel.consumption.report.Item
 * @extends O.proxy.Custom
 */
C.define('O.mon.proxy.fuel.consumption.report.Item', {
	extend: 'O.proxy.Custom',

/**
	* Proxy-object identifier
	* @type String
	*/
	id: 'mon_fuel_consumption_report_item',

/**
	* Preload text for current proxy
	* @type String
	*/
	preloadText: _('Fuel consumption report items'),

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
	model: 'Mon.Fuel.Consumption.Report.Item',

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
	type: O.mon.model.fuel.consumption.report.Item
}, function() {
	this.prototype.superclass.register(this);
});