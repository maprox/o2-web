/**
 * Service desk service proxy object
 * @class O.sdesk.proxy.Service
 * @extends O.proxy.Custom
 */
C.define('O.sdesk.proxy.Service', {
	extend: 'O.proxy.Custom',

/**
	* Proxy-object identifier
	* @type String
	*/
	id: 'sdesk_service',

/**
	* Preload text for current proxy
	* @type String
	*/
	preloadText: _('Service desk issue service list'),

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
	model: 'Sdesk.Service',

/**
	* Object type in router storage
	* @type Object
	*/
	type: O.sdesk.model.Service
}, function() {
	this.prototype.superclass.register(this);
});