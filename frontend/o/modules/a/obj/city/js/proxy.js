/**
 * @class O.a.proxy.City
 * @extends O.proxy.Custom
 */
C.define('O.a.proxy.City', {
	extend: 'O.proxy.Custom',

/**
	* Proxy-object identifier
	* @type String
	*/
	id: 'a_city',

/**
	* Preload text for current proxy
	* @type String
	*/
	preloadText: _('Cities'),

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
	model: 'A.City',

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
	type: O.a.model.City
}, function() {
	this.prototype.superclass.register(this);
});