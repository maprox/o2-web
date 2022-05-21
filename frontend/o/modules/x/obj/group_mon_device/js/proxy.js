/**
 * @class O.x.proxy.group.mon.Device
 * @extends O.proxy.Custom
 */
C.define('O.x.proxy.group.mon.Device', {
	extend: 'O.proxy.Custom',

/**
	* Proxy-object identifier
	* @type String
	*/
	id: 'x_group_mon_device',

/**
	* Preload text for current proxy
	* @type String
	*/
	preloadText: _('Group devices'),

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
	model: 'X.Group.Mon.Device',

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
	type: O.x.model.group.mon.Device
}, function() {
	this.prototype.superclass.register(this);
});