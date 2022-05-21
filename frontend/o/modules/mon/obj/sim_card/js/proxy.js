/**
 * @class O.mon.sim.Card
 * @extends O.proxy.Custom
 */
C.define('O.mon.sim.Card', {
	extend: 'O.proxy.Custom',
	xtype: 'proxy.sim-car-proxy',

/**
	* Proxy-object identifier
	* @type String
	*/
	id: 'mon_sim_card',

/**
	* Preload text for current proxy
	* @type String
	*/
	preloadText: _('Mon sim card'),

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
	model: 'Mon.Sim.Card',

/**
	* Rest controller on a backend
	* @type Boolean
	*/
	isRest: true,

/**
	* Do not reload proxy after model update
	* @type Boolean
	*/
	dontReloadAfterUpdate: false,

	/**
	* Extra parameters
	* @type Object
	*/
	extraParams: {
		'$joined': 1
	},

/**
	* Object type in router storage
	* @type Object
	*/
	type: O.mon.model.sim.Card
}, function() {
	this.prototype.superclass.register(this);
});