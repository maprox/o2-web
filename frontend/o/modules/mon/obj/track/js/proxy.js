/**
 * Monitoring tracks router
 * @class O.mon.proxy.Geofence
 * @extends O.proxy.Custom
 */
C.define('O.mon.proxy.Track', {
	extend: 'O.proxy.Custom',

/**
	* Proxy-object identifier
	* @type String
	*/
	id: 'mon_track',

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
	model: 'Mon.Track',

/**
	* Rest controller on a backend
	* @type Boolean
	*/
	isRest: true,

/**
	* Object type in router storage
	* @type Object
	*/
	type: O.mon.model.Track
}, function() {
	this.prototype.superclass.register(this);
});
