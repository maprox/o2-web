/**
 */
/**
 * HTTP-Провайдер состояний
 * @class O.state.HttpProvider
 * @extends Ext.state.Provider
 */
Ext.define('O.state.HttpProvider', {
	extend: 'Ext.state.Provider',

	delay: C.cfg.stateUpdateTime,
	saveUrl: '/state/set',
	readUrl: '/state/get',
	method: 'post',

/**
	* Объект задачи обновления состояния
	* @type Ext.util.DelayedTask
	* @private
	*/
	dt: null,

/**
	* @constructor
	* @param {Object} config Объект конфигурации
	*/
	constructor: function(config) {

		O.state.HttpProvider.superclass.constructor.call(this, config);

		this.addEvents(
			/**
			 * @event readsuccess
			 * @param {HttpProvider} this
			 */
			'readsuccess',
			/**
			 * @event readfailure
			 * @param {HttpProvider} this
			 */
			'readfailure',
			/**
			 * @event savesuccess
			 * @param {HttpProvider} this
			 */
			'savesuccess',
			/**
			 * @event savefailure
			 * @param {HttpProvider} this
			 */
			'savefailure'
		);

		Ext.apply(this, config, {
			started: false,
			queue: {}
		});

		this.readState();
		this.start();
	},

/**
	* Возвращает объект задачи по обновлению состояния
	* @return {Ext.util.DelayedTask}
	* @private
	*/
	getSubmitTask: function() {
		if (!this.dt)
			this.dt = new Ext.util.DelayedTask(this.submitState, this);
		return this.dt;
	},

	/**
	 * Запускает задачу обновления состояния
	 */
	start: function() {
		this.getSubmitTask().delay(this.delay);
		this.started = true;
	},

	/**
	 * Останавливает задачу обновления состояния
	 */
	stop: function() {
		this.getSubmitTask().cancel();
		this.started = false;
	},

	/**
	 * Устанавливает значение переданного параметра
	 * @param {String} name Параметр состояния
	 * @param {Mixed} value Значение параметра
	 */
	set: function(name, value) {
		if (!name) { return; }
		this.queueUpdate(name, value);
	},

	/**
	 * Помещает в очередь задачу на обновление состояния
	 * @param {String} name Параметр
	 * @param {Mixed} value Значение параметра
	 * @private
	 */
	queueUpdate: function(name, value) {
		var last = this.state[name];
		var changed = typeof(last) === "undefined" || last !== value;
		if (changed) {
			this.queue[name] = this.encodeValue(value);
		}
		if (this.started) {
			this.start();
		}
		return changed;
	},

/**
	* Проверяет пуста ли очередь
	* @return {Boolean}
	*/
	queueIsEmpty: function() {
		return (C.utils.count(this.queue) === 0);
	},

	/**
	 * Отправка изменений состояний на сервер
	 * @private
	 */
	submitState: function() {
		if (this.queueIsEmpty()) {
			this.getSubmitTask().delay(this.delay);
			return;
		}
		this.getSubmitTask().cancel();
		var queueCopy = C.utils.clone(this.queue);
		this.queue = {};
		Ext.Ajax.request({
			url: this.saveUrl,
			method: this.method,
			scope: this,
			success: this.onSaveSuccess,
			failure: this.onSaveFailure,
			queue: queueCopy,
			params: {
				data: Ext.encode(queueCopy)
			}
		});
	},

/**
	* Восстановление очереди после неудачного обновления
	* @param {Object} queue Очередь
	*/
	appendQueue: function(queue) {
		this.queue = Ext.applyIf(this.queue, queue);
	},

	/**
	 * Сохраняет изменения состояния
	 * @private
	 */
	onSaveSuccess: function(response, options) {
		var queue = options.queue;
		var o = {};
		try {
			o = Ext.decode(response.responseText);
		} catch (e) {
			console.error(e);
			this.appendQueue(queue);
			return;
		}
		if (!o.success) {
			this.appendQueue(queue);
			return;
		}
		for (var name in queue) {
			var value = this.decodeValue(queue[name]);
			O.state.HttpProvider.superclass.set.call(this, name, value);
		}
		this.fireEvent('savesuccess', this);
	},

	/**
	 * Ошибка на стороне сервера при сохранении
	 * @private
	 */
	onSaveFailure: function(response, options) {
		this.appendQueue(options.queue);
		this.fireEvent('savefailure', this);
	},

	/**
	 * Ошибка на стороне сервера при чтении
	 * @private
	 */
	onReadFailure: function(response, options) {
		this.fireEvent('readfailure', this);
	},

	/**
	 * Успешное чтение данных с сервера
	 * @private
	 */
	onReadSuccess: function(response, options) {
		var o = {};
		try {
			o = Ext.decode(response.responseText);
		} catch (e) {
			console.error(e);
			return;
		}
		if (o.success) {
			Ext.each(o.data, function(item) {
				this.state[item.name] = this.decodeValue(item.value);
			}, this);
			this.queue = {};
			this.fireEvent('readsuccess', this);
		}
	},

	/**
	 * Чтение данных
	 */
	readState: function() {
		var queueCopy = C.utils.clone(this.queue);
		this.queue = {};
		Ext.Ajax.request({
			url: this.readUrl,
			method: this.method,
			scope: this,
			success: this.onReadSuccess,
			failure: this.onReadFailure,
			queue: queueCopy
		});
	}
});
