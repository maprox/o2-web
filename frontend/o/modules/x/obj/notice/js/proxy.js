/**
 * @class O.x.proxy.Notice
 * @extends O.proxy.Custom
 */
C.define('O.x.proxy.Notice', {
	extend: 'O.proxy.Custom',

/**
	* Proxy-object identifier
	* @type String
	*/
	id: 'x_notice',

/**
	* Preload text for current proxy
	* @type String
	*/
	preloadText: _('Notice'),

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
	model: 'X.Notice',

/**
	* Rest controller on a backend
	* @type Boolean
	*/
	isRest: true,

/**
	* Extra parameters
	* @type Object
	*/
	/*extraParams: {
		'$joined': 1
	},*/

/**
	* Do not reload proxy after model update
	* @type Boolean
	*/
	dontReloadAfterUpdate: false,

/**
	* Object type in router storage
	* @type Object
	*/
	type: O.x.model.Notice
}, function() {
	this.prototype.superclass.register(this);
});