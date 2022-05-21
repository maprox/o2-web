/**
 * @class O.dn.proxy.WarehousesList
 * @extends O.proxy.Custom
 */
C.define('O.dn.proxy.WarehousesList', {
	extend: 'O.proxy.Custom',

/**
	* Proxy-object identifier
	* @type String
	*/
	id: 'dn_warehouse_list',

/**
	* Preload text for current proxy
	* @type String
	*/
	preloadText: _('Firm warehouse list'),

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
	model: 'Dn.WarehouseList',

/**
	* Rest controller on a backend
	* @type Boolean
	*/
	isRest: false,

/**
	* Do not reload proxy after model update
	* @type Boolean
	*/
	dontReloadAfterUpdate: false,

/**
	* Object type in router storage
	* @type Object
	*/
	type: O.dn.model.Warehouse
}, function() {
	this.prototype.superclass.register(this);
});