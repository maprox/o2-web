/**
 * Monitoring geofence router
 * @class O.mon.proxy.Geofence
 * @extends O.proxy.Custom
 */
C.define('O.mon.proxy.Geofence', {
	extend: 'O.proxy.Custom',

/**
	* Proxy-object identifier
	* @type String
	*/
	id: 'mon_geofence',

/**
	* Preload text for current proxy
	* @type String
	*/
	preloadText: _('Geofences'),

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
	model: 'Mon.Geofence',

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
		'$getaccesslist': 1
	},

/**
	* Object type in router storage
	* @type Object
	*/
	type: O.mon.model.Geofence
}, function() {
	this.prototype.superclass.register(this);
});