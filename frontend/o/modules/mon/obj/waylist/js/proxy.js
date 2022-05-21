/**
 * @class O.mon.proxy.Waylist
 * @extends O.proxy.Custom
 */
C.define('O.mon.proxy.Waylist', {
	extend: 'O.proxy.Custom',

/**
	* Proxy-object identifier
	* @type String
	*/
	id: 'mon_waylist',

/**
	* Preload text for current proxy
	* @type String
	*/
	preloadText: _('Waylists'),

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
	model: 'Mon.Waylist',

/**
	* Rest controller on a backend
	* @type Boolean
	*/
	isRest: true,

/**
	* Do not reload proxy after model update
	* @type Boolean
	*/
	dontReloadAfterUpdate: true,

/**
	* Object type in router storage
	* @type Object
	*/
	type: O.mon.model.Waylist
}, function() {
	this.prototype.superclass.register(this);
});