/**
 * Service desk priority proxy object
 * @class O.sdesk.proxy.Priority
 * @extends O.proxy.Custom
 */
C.define('O.sdesk.proxy.Priority', {
	extend: 'O.proxy.Custom',

/**
	* Proxy-object identifier
	* @type String
	*/
	id: 'sdesk_priority',

/**
	* Preload text for current proxy
	* @type String
	*/
	preloadText: _('Service desk issue priority list'),

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
	model: 'Sdesk.Priority',

/**
	* Object type in router storage
	* @type Object
	*/
	type: O.sdesk.model.Priority
}, function() {
	this.prototype.superclass.register(this);
});