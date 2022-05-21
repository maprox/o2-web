/**
 * Model data router
 * @class O.proxy.Custom
 */
Ext.define('O.proxy.Custom', {
/**
	* Proxy-object identifier
	* @type String
	*/
	id: '',

/**
	* Object type in router storage
	* @type Object
	*/
	type: O.model.Object,

/**
	* Objects list
	* @type Ext.util.MixedCollection
	* @private
	*/
	collection: null,

/**
	* Callback functions array
	* @type Object[]
	* @private
	*/
	listeners: null,

/**
	* Need preload flag.
	* If true, then data is loaded before application starts
	* @type Boolean
	*/
	needPreload: true,

/**
	* Preload text for current proxy
	* @type String
	*/
	preloadText: '...',

/**
	* Флаг "свежести" данных
	* @type Boolean
	* @protected
	*/
	isFresh: false,

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
	* Extra parameters
	* @type Object
	*/
	extraParams: null,

/**
	* Default sorters for getStore
	* @type: Object[]
	*/
	defaultSorters: [
		{property: 'name', direction: 'ASC'},
		{property: 'sdt',  direction: 'DESC'}
	],

/**
	* Объекты Store связанные с данными
	* @cfg {Ext.data.Store[]}
	*/
	createdStores: [],

/**
	* @param {Object} config Объект конфигурации
	* @constructs
	*/
	constructor: function(config) {
		this.callParent(arguments);
		Ext.apply(this, config);
		this.collection = new Ext.util.MixedCollection();
		this.listeners = {};
		this.createdStores = [];
	},

/**
	*
	*/
	setDirty: function() {
		this.isFresh = false;
	},

/**
	* Создает компонент Ext.data.Store на основе текущих данных
	* @param Object storeConfig Additional store configuration
	* @return Ext.data.JsonStore
	*/
	getStore: function(storeConfig) {
		var storeId = 'store-' + this.id + '-' + C.utils.generateUid();
		if (!this.model) {
			console.error('Error: proxy::getStore() "model" ' +
				'field not found for ' + storeId);
			return null;
		}
		storeConfig = Ext.apply({
			storeId: storeId,
			model: this.model,
			proxy: {
				type: 'memory'
			},
			sorters: this.defaultSorters,
			/*
			 * Id свежесозданных записей
			 * @cfg {Number[]}
			 */
			newIds: []
		}, storeConfig);

		var customSort = {};
		var record = Ext.create(this.model);
		if (record && record.fields) {
			record.fields.each(function(field) {
				if (field.customSort) {
					customSort[field.name] = field.customSort;
				}
			});
		}

		var store = new Ext.data.Store(storeConfig);
		store.on({
			beforeload: function (store) {
				if (!store.sorters) { return true; }
				// check custom sort fields
				store.sorters.each(function(sorter) {
					if (sorter && sorter.property) {
						if (customSort.hasOwnProperty(sorter.property)) {
							sorter.property = customSort[sorter.property];
						}
					}
				});
			},
			add: function(store, records) {
				for (var i = 0; i < records.length; i++) {
					var record = records[i];
					store.oKeyMap[record.getId()] = record.internalId;
				}
			},
			remove: function(store, record) {
				delete store.oKeyMap[record.getId()];
			},
			clear: function(store) {
				store.oKeyMap = {};
			},
			refresh: function(store) {
				store.oKeyMap = {};
				store.each(function(record) {
					store.oKeyMap[record.getId()] = record.internalId;
				});
			}
		});

		store.oKeyMap = {};
		this.updateStore(store, this.collection.getRange());
		this.createdStores.push(store);
		return store;
	},

/**
	* Вызывает переданную функцию <i>fn</i> для каждого
	* объекта из списка роутера данных
	* @param {Function} fn Callback-функция
	* @param {Object} scope Область видимости callback-функции
	*/
	each: function(fn, scope) {
		return this.collection.each(fn, scope);
	},

/**
	* Функция отправки данных в вызывающие функции
	* @param {Object[]} callbacks Массив callback функция
	* @param {Boolean} success Success flag
	* @param {Object} packet Packet from back-end
	* @return {Ext.util.MixedCollection}
	* @private
	*/
	send: function(callbacks, success, packet) {
		if (!callbacks || !Ext.isArray(callbacks)) { return null; }
		for (var i = 0; i < callbacks.length; i++) {
			var item = callbacks[i];
			if (Ext.isFunction(item.func)) {
				if (packet) {
					var collection = new Ext.util.MixedCollection();
					for (var j = 0; j < packet.data.length; j++) {
						collection.add(new this.type(packet.data[j]));
					}
				} else {
					collection = this.collection;
				}
				item.func.call(item.scope || this, collection, success, packet);
			}
		}
		return this.collection;
	},

/**
	* Вывод списка объектов роутера
	* @param {Function} callback Callback функция
	* @param {Object} sc [опц.] Область видимости
	* @return {Ext.util.MixedCollection}
	*/
	get: function(callback, sc, params) {

		if (this.isFresh && !params) {
			// если данные "свежие", выдаем их на выходе
			return this.send([{
				func: callback,
				scope: sc
			}], true);
		} else {
			// иначе посылаем запрос на обновление
			return this.reload(callback, sc, params);
		}
	},

/**
	* Returns listener type for specified type and params
	* @param {String} type Callback function type
	* @param {Object} params Request parameters
	* @return {String}
	*/
	getListenerType: function(type, params) {
		return type + (params ? JSON.stringify(params) : '');
	},

/**
	* Добавление callback функции
	* @param {String} type Тип колбэк функции
	* @param {Function} cb Функция
	* @param {Object} sc Область видимости
	*/
	addListener: function(type, cb, sc) {
		if (typeof(this.listeners[type]) == "undefined") {
			this.listeners[type] = [];
		}

		this.listeners[type].push({func: cb, scope: sc});
	},

/**
	* Очищение списка функций
	* @param {String} type Тип колбэк функции
	*/
	clearListeners: function(type) {
		this.listeners[type] = [];
	},

/**
	* Returns true if a proxy has listeners on specified type
	* @type {String} type Callback function type
	* @return {Boolean}
	*/
	hasListeners: function(type) {
		return (typeof(this.listeners[type]) != "undefined")
			&& (!Ext.isEmpty(this.listeners[type]));
	},

/**
	* Recieves a packet from server
	* @param {Object} opts
	* @param {Boolean} success
	* @param {Object} response
	* @return Object
	*/
	getPacket: function(opts, success, response) {
		var packet = null;
		if (!success || (response.status > 201)) {
			packet = {
				success: false,
				errors: [{
					code: response.status || 500,
					params: response.statusText
				}]
			};
		} else {
			packet = C.utils.getJSON(response.responseText, opts);
		}
		return packet;
	},

/**
	* Функция перезагрузки модели
	* @param {Function} callback Callback функция
	* @param {Object} scope Область видимости
	* @param {Object} params Request parameters
	* @private
	*/
	reload: function(callback, scope, params) {
		params = Ext.applyIf(params || {}, this.getExtraParams());
		var listenerType = this.getListenerType('get', params);
		var isGetting = this.hasListeners(listenerType);
		if (Ext.isFunction(callback)) {
			this.addListener(listenerType, callback, scope);
		}
		this.wasLoaded = this.needPreload || this.wasLoaded;
		if (isGetting || (!Ext.isFunction(callback) && this.wasLoaded)) {
			return this.collection;
		}
		if (!this.hasParams(params)) {
			for (var i = 0; i < this.createdStores.length; i++) {
				this.createdStores[i].fireEvent('beforeload');
			}
		}
		this.wasLoaded = true;
		params.xaction = 'read';
		Ext.Ajax.request({
			url: '/' + this.id,
			params: params,
			method: 'GET',
			callback: function(opts, success, response) {
				try
				{
					opts.callbacks = this.listeners[listenerType];
					this.clearListeners(listenerType);
					var packet = this.getPacket(opts, success, response);
					return this.update(packet, opts, params);
				}
				catch (e)
				{
					return this.update({
						errors: [{
							code: 501,
							params: [e]
						}]
					}, opts);
				}
			},
			scope: this
		});
	},

/**
	* extraParams getter
	* @return Object
	*/
	getExtraParams: function() {
		return this.extraParams || {};
	},

/**
	* Returns true if supplied object "params" is empty or
	* contains only extraParams
	* @param {Object} params
	* @return {Boolean}
	*/
	hasParams: function(params) {
		var extraParams = this.getExtraParams();
		for (var prop in params) {
			if (!params.hasOwnProperty(prop)) { continue; }
			if (prop != 'xaction' && !extraParams[prop]) {
				return true;
			}
		}
		return false;
	},

/**
	* Обновление данных хранилища и вызов пользовательской callback функции
	* @param {Object} packet Объект ответа, переданного сервером
	* @param {Object} opts Данные соединения (из них берется callback функция)
	* @private
	*/
	update: function(packet, opts, params) {
		var success = (packet && packet.success) || false;
		var hasParams = this.hasParams(params);
		if (success) {
			this.isFresh = true;
			if (!hasParams) {
				this.reloadCollection(packet.data);
			}
		}
		if (opts) {
			this.send(opts.callbacks, success,
				hasParams ? packet : null);
		}
	},

/**
	* Reloads collection with new data
	* @param {Object[]} data Full data for collection
	*/
	reloadCollection: function(data) {
		var c = this.collection;
		var ids = [];
		if (!data) { data = []; }
		for (var i = 0; i < data.length; i++) {
			var item = data[i],
				o = null;
			if (item.id) {
				o = c.getByKey(item.id);
				if (o) {
					o.set(item);
				} else {
					c.add(new this.type(item));
				}
				ids.push(item.id);
			}
		}
		// remove missed objects
		c.filterBy(function(item) {
			return Ext.Array.indexOf(ids, item.id) < 0;
		}).each(function(item) {
			c.remove(item);
		});
		// let's update stores
		this.updateStores(c.getRange());
		this.isFresh = true;
		return true;
	},

/**
	* Updates internal collection with new data
	* @param {Object[]} data Full data for collection
	* @private
	* @returns Boolean
	*/
	updateCollection: function(data) {
		if (!data) { return true; }
		var c = this.collection;
		for (var i = 0; i < data.length; i++) {
			var item = data[i],
				o = null;
			if (item.id) {

				// Remove object with state 3
				if (item.state && item.state == C.cfg.RECORD_IS_TRASHED) {
					c.removeAtKey(item.id);
					continue; // continue
				}

				// Update or add new object
				o = c.getByKey(item.id);
				if (o) {
					o.set(item);
				} else {
					c.add(new this.type(item));
				}
			}
		}

		// let's update stores
		this.updateStores(c.getRange());
		this.isFresh = true;
		return true;
	},

/**
	* Функция обновления всех Store привязанных к данным
	* @param {Object[]} data Список объектов, переданных сервером
	* @param {Object} params Additional parameters
	* @private
	*/
	updateStores: function(data, params) {
		var me = this;

		var storesCount = this.createdStores.length;
		if (storesCount > 0) {
			for (var i = 0; i < this.createdStores.length; i++) {
				var store = this.createdStores[i];
				//store.suspendEvents();
				this.updateStore(store, data, (params && params.callback) ? {
					callback: function() {
						if ((--storesCount == 0) && params && params.callback) {
							params.callback.call(params.scope || me);
						}
					}
				} : null);
				//store.resumeEvents();
			}
		} else {
			if (params && params.callback) {
				params.callback.call(params.scope || me);
			}
		}
	},

/**
	* Функция обновления Store
	* @param {Ext.data.Store} store Store который необходимо обновить
	* @param {Object[]} data Список объектов, переданных сервером
	* @param {Object} params Additional parameters in store.load(params)
	*/
	updateStore: function(store, data, params) {

		if (store.remoteSort || store.remoteFilter || !data) {
			if (store.preventInitialLoad) {
				return;
			}
			// if params specified, or there is no data in store
			if (params || (store.getCount() === 0)) {
				store.load(params);
			}
			return;
		}

		var filters = null;
		if (store.isFiltered()) {
			if (store.getFilters) {
				filters = store.getFilters();
			} else if (store.filters && store.filters.getRange) {
				filters = store.filters.getRange();
			}
			store.clearFilter();
		}

		var ids = [];
		var newRecords = [];
		for (var i = 0; i < data.length; i++) {
			var item = data[i];
			if (item.id) {
				var record = this.customGetRecordById(store, item.id);
				if (record) {
					if (store.newIds &&
						(Ext.Array.indexOf(store.newIds, item.id) > -1)) {
						Ext.Array.remove(store.newIds, item.id);
					} else {
						record.set(item);
					}
				} else {
					newRecords.push(new this.type(item));
				}
				var itemId = parseInt(item.id);
				if (itemId != item.id) {
					itemId = item.id;
				}
				ids.push(itemId);
			}
		}

		store.add(newRecords);
		store.commitChanges();
		store.sort();

		// remove missed objects
		var removedRecords = [];
		store.each(function(record) {
			if (record && Ext.Array.indexOf(ids, record.getId()) < 0) {
				if (record.getId()) {
					removedRecords.push(record);
				}
			}
		}, this);

		// single remove speedup grid rendering
		store.remove(removedRecords);

		if (filters) {
			if (C.isMobile()) {
				// TEMPORARILY? FIX FOR SENCHA TOUCH STORE FILTER
				for (var i = 0; i < filters.length; i++) {
					store.filter(filters[i]);
				}
			} else {
				store.filter(filters);
			}
		}

		// FIX: roweditor focus return
		if (window.focusedEditor && window.focusedEditor.focusContextCell) {
			window.focusedEditor.focusContextCell();
		}

		// TODO: Dirty hack, check if desktop version will work with first variant
		if (C.isMobile()) {
			store.fireEvent('load', store.getData());
		} else {
			store.fireEvent('load');
		}
	},

/**
	* Custom get record by id
	* @param {Ext.data.Store} store
	* @param {Integer }id
	*/
	customGetRecordById: function(store, id) {
		var record;
		if (store.oKeyMap && store.oKeyMap[id]) {
			record = store.data.getByKey(store.oKeyMap[id]);
		} else {
			var index = store.findExact('id', id);
			if (index > -1) {
				record = store.getAt(index);
			}
		}

		return record;
	},

	/**
	* Изменение данных модели.<br>
	* Отправка комманды на сервер (add/set/remove)
	* @param {String} command (add|set|remove)
	* @param {Object} data Объект изменений
	* @param {Function} fn Callback функция
	* @param {Object} scope Область видимости callback функции
	* @param {Array} depended Зависимые сущности
	*/
	sendCommand: function(command, data, fn, scope, depended) {
		var requestUrl = (this.isRest) ? '/' + this.id :
			Ext.String.format('/{0}/{1}', this.id, command);
		var requestParams = {};
		if (this.isRest) {
			switch (command) {
				case 'set': requestParams._method = 'PUT'; break;
				case 'remove': requestParams._method = 'DELETE'; break;
			}
			requestParams = Ext.apply(requestParams, this.getExtraParams());
			requestParams = Ext.apply(requestParams, data);
			// encode objects in request parameters
			for (var key in requestParams) {
				if (!requestParams.hasOwnProperty(key)) { continue; }
				if (Ext.isObject(requestParams[key]) ||
					Ext.isArray(requestParams[key])) {
					requestParams[key] = Ext.encode(requestParams[key]);
				}
			}
		} else {
			requestParams = Ext.apply(requestParams, {
				depended: depended,
				xaction: command,
				data: Ext.encode(data)
			});
		}
		Ext.Ajax.request({
			url: requestUrl,
			method: 'POST',
			params: requestParams,
			scope: this,
			callback: function(opts, success, response) {
				try
				{
					opts.callbacks = [{func: fn, scope: scope}];
					var packet = this.getPacket(opts, success, response);
					return this.commit(packet, opts);
				}
				catch (e)
				{
					console.error(e);
					return this.commit({
						errors: [{
							code: 501,
							params: [e]
						}]
					}, opts);
				}
			}
		});
	},

/**
	* Изменение данных модели.<br>
	* Касается только изменения свойств объектов (а не удаления/добавления)
	* В функцию необходимо передать массив изменений <i>data</i>
	* и функцию-обработчик изменений у которой должно быть
	* два параметра result и errorCode
	* @param {Object} data Объект изменений
	* @param {Function} fn Callback функция
	* @param {Object} scope Область видимости callback функции
	* @param {Array} depended Зависимые сущности
	*/
	set: function(data, fn, scope, depended) {
		return this.sendCommand('set', data, fn, scope, depended);
	},

/**
	* Добавление объекта
	* @param {Object} data Добавляемый объект
	* @param {Function} fn Callback функция
	* @param {Object} scope Область видимости callback функции
	* @param {Array} depended Зависимые сущности
	*/
	add: function(data, fn, scope, depended) {
		var me = this;

		return this.sendCommand('add', data, function(success, packet) {
			if (packet.data) {
				for (var i = 0; i < packet.data.length; i++) {
					var item = packet.data[i];
					if (item.id) {
						for (var j = 0; j < me.createdStores; j++) {
							me.createdStores[j].newIds.push(item.id);
						}
					}
				}
			}
			fn.apply(scope, arguments);
		}, scope, depended);
	},

/**
	* Удаление объекта
	* @param {Object} data Удаляемый объект
	* @param {Function} fn Callback функция
	* @param {Object} scope Область видимости callback функции
	* @param {Array} depended Зависимые сущности
	*/
	remove: function(data, fn, scope, depended) {
		fn = fn || Ext.emptyFn;
		return this.sendCommand('remove', data, fn, scope, depended);
	},

/**
	* Обновление модели в случае успешного сохранения на стороне сервера
	* @param {Object} packet Объект данных
	* @param {Object} opts Параметры, которые были переданы в запросе
	* @private
	*/
	commit: function(packet, opts) {
		var me = this;
		var success = (packet && packet.success) || false;
		if (success) {
			if (this.dontReloadAfterUpdate) {
				// we need to reload each store with remoteSort
				this.updateStores(null, {
					callback: function() {
						for (var i = 0; i < opts.callbacks.length; i++) {
							var item = opts.callbacks[i];
							if (item.func) {
								item.func.call(item.scope || me,
									success, packet, opts);
							}
						}
					}
				});
			} else {
				this.setDirty();
				this.processPacket(packet, opts);
			}
		} else {
			//this.setDirty();
			console.warn('[' + this.id + '] packet commit:', packet);
			for (var i = 0; i < opts.callbacks.length; i++) {
				var item = opts.callbacks[i];
				if (item.func) {
					item.func.call(item.scope || me,
						success, packet, opts);
				}
			}
		}
	},

/**
	 * Process successfull packet
	 * @param {Object} packet Data object
	 * @param {Object} opts Request params
	 */
	processPacket: function(packet, opts) {
		var me = this;
		var data = [];
		if (opts && opts.params) {
			if (
				opts.params._method
				&& opts.params._method == 'DELETE'
				&& opts.params.id
			) {
				data.push({
					'id': opts.params.id,
					'state': 3
				});
			} else {
				//if (Ext.isArray(packet.data)) {
				//	data = packet.data;
				//} else {
					data.push(packet.data);
				//}
			}
		}

		// Update collection
		if (data && data.length) {
			this.updateCollection(data);
		}

		// apply callbacks
		for (var i = 0; i < opts.callbacks.length; i++) {
			var item = opts.callbacks[i];
			if (item.func) {
				item.func.call(item.scope || me,
					true, packet, opts);
			}
		}
	},

/**
	* Регистрация роутера в менеджере модели
	*/
	register: function(className) {
		var prx = new className();
		O.manager.Model.register(prx);
		O.manager.Model.loaderHandlerAdd(prx.id, prx.updateCollection, prx);
	}
});
