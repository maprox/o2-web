/**
 * @class O.x.proxy.Company
 * @extends O.proxy.Custom
 */
C.define('O.x.proxy.Company', {
	extend: 'O.proxy.Custom',

/**
	* Proxy-object identifier
	* @type String
	*/
	id: 'x_company',

/**
	* Preload text for current proxy
	* @type String
	*/
	preloadText: _('Counterparty'),

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
	model: 'X.Company',

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
	type: O.x.model.Company
}, function() {
	this.prototype.superclass.register(this);
});
