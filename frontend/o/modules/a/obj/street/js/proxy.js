/**
 * @class O.a.proxy.Street
 * @extends O.proxy.Custom
 */
C.define('O.a.proxy.Street', {
	extend: 'O.proxy.Custom',

/**
	* Proxy-object identifier
	* @type String
	*/
	id: 'a_street',

/**
	* Preload text for current proxy
	* @type String
	*/
	preloadText: _('Streets'),

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
	model: 'A.Street',

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
	type: O.a.model.Street
}, function() {
	this.prototype.superclass.register(this);
});