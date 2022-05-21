/**
 * @class O.dn.proxy.AnalyticReport
 * @extends O.proxy.Custom
 */
C.define('O.dn.proxy.AnalyticReport', {
	extend: 'O.proxy.Custom',

/**
	* Proxy-object identifier
	* @type String
	*/
	id: 'dn_analytic_report',

/**
	* Preload text for current proxy
	* @type String
	*/
	preloadText: _('Analytic reports'),

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
	model: 'Dn.AnalyticReport',

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
	type: O.dn.model.AnalyticReport
}, function() {
	this.prototype.superclass.register(this);
});