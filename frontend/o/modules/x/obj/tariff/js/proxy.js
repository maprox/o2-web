/**
 * @class O.x.proxy.Tariff
 * @extends O.proxy.Custom
 */
C.define('O.x.proxy.Tariff', {
	extend: 'O.proxy.Custom',

/**
	* Proxy-object identifier
	* @type String
	*/
	id: 'x_tariff',

/**
	* Preload text for current proxy
	* @type String
	*/
	preloadText: _('Tariff'),

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
	model: 'X.Tariff',

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
	type: O.x.model.Tariff
}, function() {
	this.prototype.superclass.register(this);
});
