/**
 * Service desk issue proxy object
 * @class O.sdesk.proxy.Issue
 * @extends O.proxy.Custom
 */
C.define('O.sdesk.proxy.Issue', {
	extend: 'O.proxy.Custom',

/**
	* Proxy-object identifier
	* @type String
	*/
	id: 'sdesk_issue',

/**
	* Preload text for current proxy
	* @type String
	*/
	preloadText: _('Issues list'),

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
	model: 'Sdesk.Issue',

/**
	* Object type in router storage
	* @type Object
	*/
	type: O.sdesk.model.Issue
}, function() {
	this.prototype.superclass.register(this);
});