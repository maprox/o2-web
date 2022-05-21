/**
 * @copyright  2012, Maprox LLC
 */
/**
 * Класс менеджера приложения, отвечающего за прием данных от сервера.<br/>
 * Предоставляет списки доступных пользователю сущностей; таких как
 * устройства, группы устройств.<br/>
 * @class O.manager.Model
 * @singleton
 */
Ext.define('O.manager.Model', {
	extend: 'Ext.util.Observable',
	singleton: true,

	config: {
	/**
		* Server timestamp.
		* Timestamp of the last loaded data from server
		* @type Date
		* @accessor
		*/
		lastload: null
	},

/**
	* Список объектов прокси
	* @type Ext.util.MixedCollection
	* @private
	*/
	proxies: new Ext.util.MixedCollection(),

/**
	* Массив объектов, которые слушают изменения модели
	* @type Object[]
	* @private
	*/
	clients: [],

/**
	* Настройки нити обновления координат устройств
	* @type Object
	* @private
	*/
	updateTask: null,

/**
	* Update task request object
	* @type Object
	* @private
	*/
	updateTaskRequest: null,

/**
	* Update task request object counter.
	* Needed to determine if we try more then
	* @type Object
	* @private
	*/
	updateTaskCounter: null,

/**
	* Список "кураторов" событий
	* @type Ext.util.MixedCollection
	* @private
	*/
	curators: new Ext.util.MixedCollection(),

/**
	* Boot loaded flag
	*/
	isBootLoaded: false,

/**
	* Sockets response queue
	*/
	responseQueue: [],

/**
	* Server time returned by boot
	* @type string
	*/
	initialServerTime: null,

/**
	* Actual server time
	* @type Date
	*/
	actualServerTime: null,

/** Text fields */
	errAjaxLoad: 'Server request error.<br/>' +
		'URL: <b>{0}</b><br/>' +
		'Params: <b>{1}</b><br/>' +
		'Error code: <b>{2}</b><br/>' +
		'Description: <b>{3}</b>',
	errAjaxLoadTimedout: 'Request to server is timedout.' +
		'Probably connection is lost...<br/>' +
		'URL: <b>{0}</b><br/>' +
		'Params: <b>{1}</b>',
	errAjaxLoadInterrupt: 'Request to server is interrupted.<br/>' +
		'URL: <b>{0}</b><br/>' +
		'Params: <b>{1}</b>',
	errManagerLoad: 'Error updating of coordinates<br/>{0}',

/**
	* @constructs
	*/
	init: function() {
		// bind event listeners
		Ext.Ajax.on('requestexception', this.onAjaxFailure, this);

		C.bind('clock1', this);
	},

/**
	 * Processes sockets responses queue
	 */
	processQueue: function() {
		console.debug('Process queue');
		if (this.responseQueue.length) {
			while (this.responseQueue.length) {
				var r = this.responseQueue.shift();
				this.processSocketResponse(r);
			}
			Ext.Function.defer(this.processQueue, 1, this);
		} else {
			console.debug('Queue processed: set isBootLoaded = true');
			this.isBootLoaded = true;
		}
	},

/**
	* Action procesed every second
	*/
	onUpdateClock1: function() {
		// Update actual server time
		if (this.initialServerTime && this.actualServerTime) {
			// Add one second
			this.actualServerTime =
				new Date(this.actualServerTime.getTime() + 1000);
		}
	},

/**
	* Starts update task
	*/
	start: function() {
		console.debug('Start clock tasks');
		var me = this;

		// Start clock tasks
		Ext.TaskManager.start({
			run: function() {
				var curator = me.getCurator('clock1');
				curator.fireEvent('update');
			},
			interval: 1000 // 1 second
		});
		Ext.TaskManager.start({
			run: function() {
				var curator = me.getCurator('clock5');
				curator.fireEvent('update');
			},
			interval: 5000 // 5 second2
		});
		Ext.TaskManager.start({
			run: function() {
				var curator = me.getCurator('clock10');
				curator.fireEvent('update');
			},
			interval: 10000 // 5 second2
		});

		// Boot loaded successfully
		// Check if there is some responses in queue
		//this.processQueue();

		//console.debug('Loading done');
	},

/**
	 * Processes socket response
	 * @param {Object} response
	 */
	processSocketResponse: function(response) {
		console.debug('Process socket response');
		if (!response || !response.data) {
			return;
		}

		for (var curatorName in response.data) {
			var data = response.data[curatorName];

			if (!data) {
				continue;
			}

			var curator = this.getCurator(curatorName);
			curator.fireEvent('update',
				data,
				curatorName
			);
		}
	},

/**
	 * Receiving data from node.js
	 * @param {Object} response
	 */
	onSocketResponse: function(response) {
		console.debug('onSocketResponse: update received');
		// If boot hasn't been loaded yet
		if (!this.isBootLoaded) {
			console.debug('onSocketResponse: boot is not loaded yet');
			//console.debug('Add response to queue');
			// Save socket response to response queue
			console.debug('onSocketResponse: add response to queue');
			this.responseQueue.push(response);
			return;
		}

		// Process response
		this.processSocketResponse(response);
	},

/**
	* Функция, возвращающая в переданную процедуру <i>fn</i>
	* массив объектов запрашиваемого типа <i>type</i>.<br/>
	* Callback функции <i>fn</i> в качестве параметров передаются
	* <dl>
	*  <dt>list</dt>
	*  <dd>список выбранных объектов</dd>
	*  <dt>manager</dt>
	*  <dd>Указатель на менеджер модели {@link O.manager.Model}</dd>
	* </dl>
	* @param {String/String[]} type Тип запрашиваемых объектов
	* @param {Function} fn Callback функция, в которую будет передан массив
	* @param {Object} scope Область видимости функции
	* @return {Ext.util.MixedCollection}
	*/
	get: function(type, fn, scope, params) {
		if (Ext.isArray(type)) {
			var loadedTypes = C.utils.copy(type);
			Ext.each(type, function(t) {
				O.manager.Model.get(t, function() {
					Ext.Array.remove(loadedTypes, t);
					if (Ext.isEmpty(loadedTypes)) {
						fn.call(scope || this);
					}
				}, this, params);
			}, this);
			return;
		}
		var proxy = this.getProxy(type, true);
		if (Ext.isEmpty(proxy)) {
			return console.error('Error: proxy "' + type + '" does not exists');
		}
		if (Ext.isFunction(proxy.get)) {
			return proxy.get(fn, scope, params);
		}
	},

/**
	* Изменение данных модели
	* @param {String} type Тип изменяемого объекта
	* @param {Object} changes Изменения, которые необходимо проделать
	* @param {Function} fn Callback функция, в которую будет передан массив
	* @param {Object} scope Область видимости функции
	* @param {Array} depended Зависимые сущности
	*/
	set: function(type, changes, fn, scope, depended) {
		var proxy = this.getProxy(type);
		if (Ext.isEmpty(proxy)) {
			return console.error('Error: proxy "' + type + '" does not exists');
		}
		if (Ext.isFunction(proxy.set)) {
			proxy.set(changes, fn, scope, depended);
		}
	},


/**
	* Добавление объекта (группа, устройство, пользователь и т.д.)
	* @param {String} type Тип добавляемого объекта
	* @param {Object} obj Добавляемый объект
	* @param {Function} fn Callback функция, в которую будет передан массив
	* @param {Object} scope Область видимости функции
	* @param {Array} depended Зависимые сущности
	*/
	add: function(type, obj, fn, scope, depended) {
		var proxy = this.getProxy(type);
		if (Ext.isEmpty(proxy)) {
			return console.error('Error: proxy "' + type + '" does not exists');
		}
		if (Ext.isFunction(proxy.add)) {
			proxy.add(obj, fn, scope, depended);
		}
	},

/**
	* Удаление объекта (группа, устройство, пользователь и т.д.)
	* @param {String} type Тип удаляемого объекта
	* @param {Object} obj Удаляемый объект
	* @param {Function} fn Callback функция, в которую будет передан массив
	* @param {Object} scope Область видимости функции
	* @param {Array} depended Зависимые сущности
	*/
	remove: function(type, obj, fn, scope, depended) {
		var proxy = this.getProxy(type);
		if (Ext.isEmpty(proxy)) {
			return console.error('Error: proxy "' + type + '" does not exists');
		}
		if (Ext.isFunction(proxy.remove)) {
			proxy.remove(obj, fn, scope, depended);
		}
	},

/**
	* Регистрация прокси в менеджере модели
	* @param {O.proxy.Custom} proxy Объект прокси
	*/
	register: function(proxy) {
		this.proxies.add(proxy);
		this.bindProxy([proxy.id], proxy);
	},

/**
	* Returns a proxy object by its name
	* @param {String} type Proxy alias
	* @param {Boolean} createIfNotFound Create proxy of such type if not found
	* (defaults to false)
	* @returns O.proxy.Custom
	*/
	getProxy: function(type, createIfNotFound) {
		var proxy = this.proxies.get(type);
		if (!proxy && createIfNotFound) {
			proxy = new O.proxy.Custom({id: type});
			this.register(proxy); // register this proxy for further use
		}
		return proxy;
	},

/**
	* Returns all proxies
	*/
	getProxies: function() {
		var list = [];
		this.proxies.each(function(proxy) {
			//if (proxy.needPreload) {
			list.push(proxy);
			//}
		}, this);

		return list;
	},

/**
	* Добавление клиента "прослушки" изменения модели.
	* <p>Клиентом может быть функция или объект, у которого должен
	* быть метод <i>onChangeDependence</i></p>
	* @param {String[]} list Список сущностей от которых зависит клиент
	* @param {Object/Function} obj Объект или функция клиента
	* @param {Object} scope [опц.] Область видимости вызова функции клиента
	*/
	bind: function(list, obj, scope) {
		var item = {m: list};
		if (Ext.isFunction(obj)) {
			// регистрация простой функции
			item.o = null;
			item.f = obj;
			item.s = scope || this;
			this.clients.push(item);
			for (var i = 0; i < list.length; i++) {
				this.loaderHandlerAdd(list[i], item.f, item.s);
			}
		}
	},

/**
	* Добавление клиента "прослушки" изменения модели.
	* <p>Клиентом может быть функция или объект, у которого должен
	* быть метод <i>onChangeDependence</i></p>
	* @param {String[]} list Список сущностей от которых зависит клиент
	* @param {Object/Function} obj Объект или функция клиента
	* @param {Object} scope [опц.] Область видимости вызова функции клиента
	*/
	bindProxy: function(list, obj, scope) {
		var item = {m: list};
		if (Ext.isObject(obj)) {
			if (Ext.isFunction(obj.onChangeDependence)) {
				item.o = obj;
				item.f = obj.onChangeDependence;
				item.s = scope || obj;
				/*
				for (var i = 0; i < list.length; i++) {
					this.loaderHandlerAdd(list[i], item.f, item.s);
				}
				*/
				if (obj instanceof Ext.util.Observable) {
					obj.on('destroy', this.onClientDestroy, this);
				}
			}
		}
		if (Ext.isFunction(item.f)) {
			this.clients.push(item);
		}
	},

/**
	* Удаление объекта
	* @param {Object/Function} obj Объект или функция клиента
	* @return {Object} Удаленный объект, либо false при ошибке удаления
	*/
	unbind: function(obj) {
		var client = null;
		Ext.each(this.clients, function(item) {
			if (!Ext.isEmpty(client)) { return false; }
			if (Ext.isFunction(obj)) {
				if (item.f == obj)
					client = item;
			} else
			if (Ext.isObject(obj)) {
				if (Ext.isObject(item.o))
					if (item.o == obj)
						client = item;
			}
			return true;
		}, this);
		return Ext.Array.remove(this.clients, client);
	},

/**
	* Функция удаления клиента из прослушиваемых при его уничтожении
	* @param {Ext.util.Observable} sender Уничтожаемый объект
	*/
	onClientDestroy: function(sender) {
		this.unbind(sender);
	},

/**
	* AJAX error handler
	* @param {Connection} conn Connection object
	* @param {Object} response XMLHttpRequest
	* @param {Object} opts Params wich were specified in request
	* @private
	*/
	onAjaxFailure: function(conn, response, opts) {
		if (this.testCommonErrors(response)) {
			return;
		}
		if (!C.cfg.debug) { return; }
		var msgText = null;
		if (response.timedout) {
			msgText = Ext.String.format(
				O.manager.Model.errAjaxLoadTimedout,
				opts.url,
				JSON.stringify(opts.params)
			);
		} else {
			if (!response.status && !response.statusText) {
				msgText = Ext.String.format(
					O.manager.Model.errAjaxLoadInterrupt,
					opts.url,
					JSON.stringify(opts.params)
				);
			} else {
				msgText = Ext.String.format(
					O.manager.Model.errAjaxLoad,
					opts.url,
					JSON.stringify(opts.params),
					response.status,
					response.statusText
				);
			}
		}
		if (opts.params &&
			!Ext.isEmpty(opts.params.critical) &&
			 opts.params.critical) {
			O.msg.die(msgText, 0);
		} else {
			O.msg.warning({
				msg: msgText,
				delay: 60000
			});
		}
	},

/**
	* Checks for common errors like authorization problems and handles them
	* @param {Object} response XMLHttpRequest
	* @private
	*/
	testCommonErrors: function(response) {
		if (response.status == 401) {
			var packet = C.utils.getJSON(response.responseText, {silent: true});
			if (packet.errors && packet.errors.length) {
				var error = packet.errors[0];
				if (error && error.code) {
					O.app.terminate(error.code, packet)
				}
			}
			return true;
		}
		return false;
	},

/**
	* Returns user settings array<br/>
	* Is a shortcut for
	* <pre><code>O.manager.Model.get('settings', function(s) {});</code></pre>
	* @see O.manager.Model.getSettings()
	* @return {Ext.util.MixedCollection}
	*/
	getSettings: function() {
		return this.get('settings');
	},

/**
	* Return user option by its name
	* @see O.manager.Model.getSettings()
	* @param {String} name Name of the setting
	* @param {Ext.util.MixedCollection} list [opt.] List of settings
	* @param {Boolean} noError Not display error if settings not loaded
	* @return {String|null} Value of the setting
	*/
	getSetting: function(name, list, noError) {
		var s = list || this.getSettings();
		if (s) {
			var p = s.get(name);
			if (p) {
				return p.value;
			} else {
				O.msg.warning('Can not find setting "' + name +'"!');
				return null;
			}
		} else if (!noError) {
			O.msg.error('Settings are not loaded');
		}
		return null;
	},

/**
	* Returns a curator object
	* @param {String} curatorName Curator identifier
	* @return {Ext.util.Observable}
	*/
	getCurator: function(curatorName) {
		var c = this.curators.get(curatorName);
		if (!c) {
			c = new Ext.util.Observable();
			this.curators.add(curatorName, c);
		}
		return c;
	},

/**
	* Adds a handler for an update model curator
	* @param {String} curatorName Name of curator
	* @param {Function} fn Handler function
	* @param {Object} scope
	*/
	loaderHandlerAdd: function(curatorName, fn, scope) {
		var c = this.getCurator(curatorName);
		if (c) {
			c.addListener('update', fn, scope);
		}
	},

/**
	* Returns the current session identifier
	*/
	getLastSession: function() {
		if (!this.lastsession) {
			var match = document.cookie.match(/PHPSESSID=([^;]+)/);
			if (match) {
				this.lastsession = match[1];
			} else {
				document.reload('logout');
			}
		}
		return this.lastsession;
	},

/**
	* Returns current server time.
	*/
	getServerTime: function() {
		return this.actualServerTime;
		//return new Date().toUtc();
	}

});
