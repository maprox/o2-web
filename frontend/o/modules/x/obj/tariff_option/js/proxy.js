/**
 * @class O.x.proxy.tariff.Option
 * @extends O.proxy.Custom
 */
C.define('O.x.proxy.tariff.Option', {
	extend: 'O.proxy.Custom',

/**
	* Proxy-object identifier
	* @type String
	*/
	id: 'x_tariff_option',

/**
	* Preload text for current proxy
	* @type String
	*/
	preloadText: _('Tariff options'),

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
	model: 'X.tariff.Option',

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
	* Object type in router storage
	* @type Object
	*/
	type: O.x.model.tariff.Option
}, function() {
	this.prototype.superclass.register(this);
});
