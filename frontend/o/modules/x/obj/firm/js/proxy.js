/**
 *
 * Firms proxy object
 * @class O.x.proxy.Firm
 * @extends O.proxy.Custom
 */
C.define('O.x.proxy.Firm', {
	extend: 'O.proxy.Custom',

/**
	* Идентификатор прокси-объекта
	* @type String
	*/
	id: 'x_firm',

/**
	* Текст предзагрузки для прокси
	* @type String
	*/
	preloadText: 'Firms',
	needPreload: false,

	model: 'X.Firm',
	isRest: true,

/**
	* Extra parameters
	* @type Object
	*/
	extraParams: {
		'$joined': 1
	},

/**
	* Тип объектов в хранилище роутера
	* @type Object
	*/
	type: O.x.model.Firm
}, function() {
	this.prototype.superclass.register(this);
});
