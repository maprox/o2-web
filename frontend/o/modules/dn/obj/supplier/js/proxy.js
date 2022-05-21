/**
 * @class O.dn.proxy.Supplier
 * @extends O.proxy.Custom
 */
C.define('O.dn.proxy.Supplier', {
	extend: 'O.proxy.Custom',

/**
	* Proxy-object identifier
	* @type String
	*/
	id: 'dn_supplier',

/**
	* Preload text for current proxy
	* @type String
	*/
	preloadText: _('Catering suppliers'),

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
	model: 'Dn.Supplier',

/**
	* Rest controller on a backend
	* @type Boolean
	*/
	isRest: false,

/**
	* Do not reload proxy after model update
	* @type Boolean
	*/
	dontReloadAfterUpdate: false,

/**
	* Object type in router storage
	* @type Object
	*/
	type: O.dn.model.Supplier
}, function() {
	this.prototype.superclass.register(this);
});