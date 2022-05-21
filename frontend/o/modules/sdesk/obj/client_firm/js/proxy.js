/**
 * Service desk issue proxy object
 * @class O.sdesk.proxy.ClientFirm
 * @extends O.proxy.Custom
 */
C.define('O.sdesk.proxy.ClientFirm', {
	extend: 'O.proxy.Custom',

/**
	* Proxy-object identifier
	* @type String
	*/
	id: 'sdesk_client_firm',

/**
	* Preload text for current proxy
	* @type String
	*/
	preloadText: _('Service desk client firms list'),

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
	model: 'Sdesk.ClientFirm',

/**
	* Object type in router storage
	* @type Object
	*/
	type: O.sdesk.model.ClientFirm
}, function() {
	this.prototype.superclass.register(this);
});