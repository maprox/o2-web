/**
 * @class O.x.proxy.Report
 * @extends O.proxy.Custom
 */
C.define('O.x.proxy.Report', {
	extend: 'O.proxy.Custom',

/**
	* Proxy-object identifier
	* @type String
	*/
	id: 'x_report',

/**
	* Preload text for current proxy
	* @type String
	*/
	preloadText: _('Reports'),

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
	model: 'X.Report',

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
	type: O.x.model.Report
}, function() {
	this.prototype.superclass.register(this);
});