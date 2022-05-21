/**
 * @class O.dn.proxy.Act
 * @extends O.proxy.Custom
 */
C.define('O.dn.proxy.Act', {
	extend: 'O.proxy.Custom',

/**
	* Proxy-object identifier
	* @type String
	*/
	id: 'dn_act',

/**
	* Preload text for current proxy
	* @type String
	*/
	preloadText: _('Firm acts'),

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
	model: 'Dn.Act',

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
	type: O.dn.model.Act
}, function() {
	this.prototype.superclass.register(this);
});