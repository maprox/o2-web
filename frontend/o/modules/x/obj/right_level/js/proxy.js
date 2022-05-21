/**
 * @class O.x.proxy.Right_level
 * @extends O.proxy.Custom
 */
C.define('O.x.proxy.Right_level', {
	extend: 'O.proxy.Custom',

/**
	* Proxy-object identifier
	* @type String
	*/
	id: 'x_right_level',

/**
	* Preload text for current proxy
	* @type String
	*/
	preloadText: _('Right levels'),

/**
	* Need preload flag.
	* If true, then data is loaded before application starts
	* @type Boolean
	*/
	needPreload: true, // Can't be false

/**
	* Ext.data.Model name of a record in a proxy store
	* @type String
	*/
	model: 'X.Right_level',

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
	type: O.x.model.Right_level
}, function() {
	this.prototype.superclass.register(this);
});