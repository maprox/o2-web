/**
 * @class O.dn.proxy.Worker
 * @extends O.proxy.Custom
 */
C.define('O.dn.proxy.Worker', {
	extend: 'O.proxy.Custom',

/**
	* Proxy-object identifier
	* @type String
	*/
	id: 'dn_worker',

/**
	* Preload text for current proxy
	* @type String
	*/
	preloadText: _('Firm workers'),

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
	model: 'Dn.Worker',

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
	//extraParams: {
	//	'$joined': 1
	//},

/**
	* Default sorters for getStore
	* @type: Object[]
	*/
	defaultSorters: [
		{property: 'fullname', direction: 'ASC',
			transform: function(val) {
				if (val) {
					return val.toLowerCase();
				}
			}
		}
	],

/**
	* Object type in router storage
	* @type Object
	*/
	type: O.dn.model.Worker
}, function() {
	this.prototype.superclass.register(this);
});