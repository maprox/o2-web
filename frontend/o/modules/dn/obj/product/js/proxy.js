/**
 *
 * Product proxy object
 * @class O.proxy.dn.Product
 * @extends O.proxy.Custom
 */
C.define('O.proxy.dn.Product', {
	extend: 'O.proxy.Custom',

/**
	* Идентификатор прокси-объекта
	* @type String
	*/
	id: 'dn_product',

/**
	* Текст предзагрузки для прокси
	* @type String
	*/
	preloadText: 'Products',

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
	model: 'Dn.Product',

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
	* Тип объектов в хранилище роутера
	* @type Object
	*/
	type: O.model.dn.Product
}, function() {
	this.prototype.superclass.register(this);
});