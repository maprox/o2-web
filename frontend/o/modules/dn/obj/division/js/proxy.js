/**
 * @class O.dn.proxy.Division
 * @extends O.proxy.Custom
 */
C.define('O.dn.proxy.Division', {
	extend: 'O.proxy.Custom',

/**
	* Proxy-object identifier
	* @type String
	*/
	id: 'dn_division',

/**
	* Preload text for current proxy
	* @type String
	*/
	preloadText: _('Vehicle division'),

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
	model: 'Dn.Division',

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
	type: O.dn.model.Division
}, function() {
	this.prototype.superclass.register(this);
});