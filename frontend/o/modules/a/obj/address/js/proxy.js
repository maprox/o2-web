/**
 * @class O.a.proxy.Address
 * @extends O.proxy.Custom
 */
C.define('O.a.proxy.Address', {
	extend: 'O.proxy.Custom',

/**
	* Proxy-object identifier
	* @type String
	*/
	id: 'a_address',

/**
	* Preload text for current proxy
	* @type String
	*/
	preloadText: _('Address'),

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
	model: 'A.Address',

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
	* Изменение данных модели.<br>
	* Данная прокси на настоящий момент - ReadOnly
	* Отправка комманды на сервер (add/set/remove)
	* @param {String} command (add|set|remove)
	* @param {Object} data Объект изменений
	* @param {Function} fn Callback функция
	* @param {Object} scope Область видимости callback функции
	* @param {Array} depended Зависимые сущности
	*/
	sendCommand: function(command, data, fn, scope, depended) {},

/**
	* Создает компонент Ext.data.Store на основе текущих данных
	* Поскольку эта прокси только для чтения и добавления, но не для удаления, можно спокойно иметь один компонент store
	* @param Object storeConfig Additional store configuration
	* @return Ext.data.JsonStore
	*/
	getStore: function(storeConfig) {
		if (this.createdStores[0]) {
			return this.createdStores[0];
		}

		var store = this.callParent(arguments);
		store.addItem = function(model) {
			var id = model.get ? model.get('id') : model.id;
			if (!this.getById(id)) {
				this.add(model);
			}
		}
		return store;
	},

/**
	* Object type in router storage
	* @type Object
	*/
	type: O.a.model.Address
}, function() {
	this.prototype.superclass.register(this);
});
