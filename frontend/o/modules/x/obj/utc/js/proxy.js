/**
 * @class O.x.proxy.Utc
 * @extends O.proxy.Custom
 */
C.define('O.x.proxy.Utc', {
	extend: 'O.proxy.Custom',

/**
	* Proxy-object identifier
	* @type String
	*/
	id: 'x_utc',

/**
	* Preload text for current proxy
	* @type String
	*/
	preloadText: _('UTC'),

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
	model: 'X.Utc',

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
	type: O.x.model.Utc
}, function() {
	this.prototype.superclass.register(this);
});
