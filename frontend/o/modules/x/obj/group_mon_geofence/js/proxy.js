/**
 * @class O.x.proxy.group.mon.Device
 * @extends O.proxy.Custom
 */
C.define('O.x.proxy.group.mon.Geofence', {
	extend: 'O.proxy.Custom',

/**
	* Proxy-object identifier
	* @type String
	*/
	id: 'x_group_mon_geofence',

/**
	* Preload text for current proxy
	* @type String
	*/
	preloadText: _('Group geofence'),

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
	model: 'X.Group.Mon.Geofence',

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
	* Do not reload proxy after model update
	* @type Boolean
	*/
	dontReloadAfterUpdate: false,

/**
	* Object type in router storage
	* @type Object
	*/
	type: O.x.model.group.mon.Geofence
}, function() {
	this.prototype.superclass.register(this);
});