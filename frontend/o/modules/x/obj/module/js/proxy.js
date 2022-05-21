/**
 * @class O.x.proxy.Module
 * @extends O.proxy.Custom
 */
C.define('O.x.proxy.Module', {
	extend: 'O.proxy.Custom',

/**
	* Proxy-object identifier
	* @type String
	*/
	id: 'x_module',

/**
	* Preload text for current proxy
	* @type String
	*/
	preloadText: _('Modules'),

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
	model: 'X.Module',

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
	type: O.x.model.Module
}, function() {
	this.prototype.superclass.register(this);
});
