/**
 * @class O.mon.proxy.geofence.Presence
 * @extends O.proxy.Custom
 */
C.define('O.mon.proxy.geofence.Presence', {
	extend: 'O.proxy.Custom',

/**
	* Proxy-object identifier
	* @type String
	*/
	id: 'mon_geofence_presence',

/**
	* Preload text for current proxy
	* @type String
	*/
	preloadText: _('Geofence presence'),

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
	model: 'Mon.geofence.Presence',

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
		sort: Ext.JSON.encode([{
			property: 'sdt'
		}])
	},

/**
	* Object type in router storage
	* @type Object
	*/
	type: O.mon.model.geofence.Presence
}, function() {
	this.prototype.superclass.register(this);
});