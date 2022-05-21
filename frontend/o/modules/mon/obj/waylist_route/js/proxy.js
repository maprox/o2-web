/**
 * @class O.mon.proxy.WaylistRoute
 * @extends O.proxy.Custom
 */
C.define('O.mon.proxy.WaylistRoute', {
	extend: 'O.proxy.Custom',

/**
	* Proxy-object identifier
	* @type String
	*/
	id: 'mon_waylist_route',

/**
	* Preload text for current proxy
	* @type String
	*/
	preloadText: _('Waylist route'),

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
	model: 'Mon.WaylistRoute',

/**
	* Rest controller on a backend
	* @type Boolean
	*/
	isRest: true,

	/**
	 * Extra parameters
	 * @type Object
	 */
	extraParams: {
		'$joined': 1,
		'sort': Ext.JSON.encode([{
			property: 'num'
		}])
	},

/**
	* Do not reload proxy after model update
	* @type Boolean
	*/
	dontReloadAfterUpdate: true,

/**
	* Object type in router storage
	* @type Object
	*/
	type: O.mon.model.WaylistRoute
}, function() {
	this.prototype.superclass.register(this);
});