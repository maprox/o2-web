/**
 * @class O.mon.proxy.Vehicle
 * @extends O.proxy.Custom
 */
C.define('O.mon.proxy.Vehicle', {
	extend: 'O.proxy.Custom',

/**
	* Proxy-object identifier
	* @type String
	*/
	id: 'mon_vehicle',

/**
	* Preload text for current proxy
	* @type String
	*/
	preloadText: _('Firm vehicles'),

/**
	* Need preload flag.
	* If true, then data is loaded before application starts
	* @type Boolean
	*/
	needPreload: true, // Can't be false

/**
	* Ext.data.Model name of a record in a proxy store
	* @type String
	*/
	model: 'Mon.Vehicle',

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
		'$joined': 1
	},

/**
	* Do not reload proxy after model update
	* @type Boolean
	*/
	dontReloadAfterUpdate: false,

/**
	* Object type in router storage
	* @type Object
	*/
	type: O.mon.model.Vehicle
}, function() {
	this.prototype.superclass.register(this);
});