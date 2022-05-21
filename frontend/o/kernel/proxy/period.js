/**
 * @copyright  2012, Maprox LLC
 */
/**
 * Класс контейнера объектов
 * Основной задачей контейнера объектов является кеширование
 * результатов, полученных со стороны сервера
 *
 * @class O.kernel.proxy.Period
 * @extends Ext.util.Observable
 */
Ext.define('O.kernel.proxy.Period', {
	extend: 'Ext.util.Observable',

/**
	* Флаг отключения кеширования запросов.<br/>
	* Если флаг false, то данные каждый раз при вызове
	* функции get запрашиваются у сервера
	* @type Boolean
	* @private
	*/
	cacheDisabled: false,

/**
	* Данные о загруженных периодах
	* @type Array
	* @protected
	*/
	periods: null,

/**
	* Список закешированных объектов
	* @type Array
	* @protected
	*/
	objects: null,

/**
	* Name of field wich is compared in periods
	* @type String
	*/
	objectPeriodField: 'dt',

/**
	* Массив колбэк функций
	* @type Object[]
	* @private
	*/
	listeners: null,

/**
	* Флаг ожидания ответа от сервера
	* @type Boolean
	* @protected
	*/
	isLoading: false,

/**
	* @constructs
	* @param {Object} Объект конфигурации
	*/
	constructor: function(config) {
		Ext.apply(this, config);
		this.callParent(arguments);
		this.periods = [];
		this.objects = new Ext.util.MixedCollection();
		this.objects.getKey = this.getObjectKey;
		this.listeners = [];
	},

/**
	* Функция сравнения параметров.<br>
	* Если параметр paramLess меньше paramMore, то возвращает +[N],
	* если параметр paramLess больше paramMore, то возвращает -[N],
	* если параметры равны - возаращает 0
	* @param {Object} paramLess
	* @param {Object} paramMore
	* @return {int}
	* @private
	*/
	compare: function(paramLess, paramMore) {
		return paramLess < paramMore ? -1 : paramLess == paramMore ? 0 : 1;
	},

/**
	* Функция установки флага cacheDisabled в значение value
	* @param {Boolean} value Значение флага cacheDisabled
	*/
	setCacheEnabled: function(value) {
		this.cacheDisabled = !value;
	},

/**
	* Отключение кеширования данных
	*/
	disableCache: function() {
		this.setCacheEnabled(false);
	},

/**
	* Включение кеширования данных
	*/
	enableCache: function() {
		this.setCacheEnabled(true);
	},

/**
	* Возвращает закеширован ли период period
	* @param {Object} p Период данных
	* @return {Boolean}
	* @private
	*/
	periodIsCached: function(p) {
		var index = -1;
		while (++index < this.periods.length) {
			var p_cached = this.periods[index];
			var isIn = (this.compare(p_cached.begin, p.begin) <= 0)
			        && (this.compare(p.end, p_cached.end) <= 0);
			if (isIn) { return true; }
		}
		return false;
	},

/**
	* Добавление callback функции
	* @param {Function} cb Функция
	* @param {Object} sc Область видимости
	*/
	addListener: function(cb, sc) {
		this.listeners.push({func: cb, scope: sc});
	},

/**
	* Очищение списка функций
	* @param {String} type Тип колбэк функции
	*/
	clearListeners: function() {
		this.listeners = [];
	},

/**
	* Загрузка данных с сервера
	* @param {Object} params Опции запроса
	* @protected
	*/
	load: function(params) {
		if (Ext.isFunction(params.fn))
			this.addListener(params.fn, params.scope);
		if (this.isLoading) { return; }
		this.isLoading = true;
		Ext.Ajax.request({
			url: this.id,
			params: {period: Ext.encode(params.period)},
			callback: function(opts, success, response) {
				try
				{
					opts.params = params;
					opts.callbacks = this.listeners;
					this.clearListeners();
					this.isLoading = false;
					// ошибка 500 (обрабатывается менеджером модели)
					if (!success) { return null; }
					var packet = C.utils.getJSON(response.responseText, opts);
					return this.update(packet, opts);
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
	* Обновление данных хранилища и вызов пользовательской callback функции
	* @param {Object} packet Объект ответа, переданного сервером
	* @param {Object} opts Данные соединения (из них берется callback функция)
	* @private
	*/
	update: function(packet, opts) {
		var success = (packet && packet.success) || false;
		var data = success ? packet.data : [];
		if (success) {
			this.set(opts.params.period, data);
		}
		this.send(opts, data, success);
	},

/**
	* Returns true, if period1 intersects with period2
	* @param {Object} period1
	* @param {Object} period2
	* @return {Boolean}
	*/
	hasIntersection: function(period1, period2) {
		return (this.compare(period2.begin, period1.end) <= 0)
		    && (this.compare(period1.begin, period2.end) <= 0);
	},

/**
	* Periods merge.
	* If periods intersects, then the output is a new period, else
	* the output is a sorted array of two periods
	* @param {Object} period1
	* @param {Object} period2
	* @return {Object|Array}
	*/
	mergePeriods: function(period1, period2) {
		var result = null;
		var p1 = period1;
		var p2 = period2;
		if (this.compare(p1.begin, p2.begin) > 0) {
			p1 = period2;
			p2 = period1;
		}
		if (this.hasIntersection(p1, p2)) {
			result = {
				begin: p1.begin,
				end: p2.end
			};
		} else {
			result = [p1, p2];
		}
		return result;
	},

/**
	* Inserts period into 'periods' array
	* @param {Object} p Inserting period
	*/
	insertPeriod: function(p) {
		var index = -1;
		while (++index < this.periods.length) {
			var p_cached = this.periods[index];
			if (this.compare(p.begin, p_cached.begin) <= 0) {
				var p_new = this.mergePeriods(p, p_cached);
				var spliceCount = 1;
				if (Ext.isArray(p_new)) {
					p_new = p_new[0];
					spliceCount = 0;
				}
				this.periods.splice(index, spliceCount, p_new);
				return;
			} else {
				if (this.hasIntersection(p, p_cached)) {
					p_new = this.mergePeriods(p, p_cached);
					this.periods.splice(index, 1, p_new);
					if (index + 1 < this.periods.length) {
						var p_cached2 = this.periods[index + 1];
						if (this.hasIntersection(p_new, p_cached2)) {
							p_new = this.mergePeriods(p_new, p_cached2);
							this.periods.splice(index, 2, p_new);
						}
					}
					return;
				}
			}
		}
		this.periods.push(p);
	},

/**
	* Returns an object key
	* @param {Object} o Object
	* @return {Object} Key
	*/
	getObjectKey: function(o) {
		return JSON.stringify(o);
	},

/**
	* Returns true if object o is already in collection
	* @param {Object} o Object
	* @return {Boolean}
	*/
	objectExists: function(o) {
		return this.objects.containsKey(this.objects.getKey(o));
	},

/**
	* Clear cached data
	*/
	clear: function() {
		this.objects.clear();
		this.periods = [];
	},

/**
	* Функция отправки данных в вызывающие функции
	* @param {Object} opts Опции запроса
	* @param {Object[]} data Массив данных
	* @param {Boolean} success Success flag
	* @private
	*/
	send: function(opts, data, success) {
		if (!Ext.isArray(opts.callbacks)) { return; }
		Ext.each(opts.callbacks, function(item) {
			if (Ext.isFunction(item.func))
				item.func.call(item.scope || this,
					data, opts.params.period, success);
		}, this);
	},

/**
	* Returns true if object in period
	* @param {Object} object
	* @param {Object} period
	*/
	objectInPeriod: function(object, period) {
		return (this.compare(period.begin, object[this.objectPeriodField]) <= 0
		     && this.compare(object[this.objectPeriodField], period.end) <= 0);
	},

/**
	* Gets list of objects by period
	* @param {Object} period
	*/
	getCachedObjects: function(period) {
		return this.objects.filterBy(function(object) {
			return this.objectInPeriod(object, period);
		}, this).getRange();
	},

/**
	* Функция возвращает данные
	* @param {Object} period Период данных
	* @param {Function} callback Callback функция
	* @param {Object} sc [опц.] Область видимости
	*/
	get: function(period, callback, sc) {
		if (!this.cacheDisabled) {
			if (this.periodIsCached(period)) {
				// loading from cache
				this.send({
					callbacks: [{
						func: callback,
						scope: sc
					}],
					params: {period: period}
				}, this.getCachedObjects(period), true);
			}
		}
		this.load({
			period: period,
			fn: callback,
			scope: sc
		});
	},

/**
	* Запись данных в кеш
	* @param {Object} period Период данных
	* @param {Object[]} objects Массив объектов
	*/
	set: function(period, objects) {
		if (this.cacheDisabled) { return; }
		this.insertPeriod(period);
		Ext.each(objects, function(o) {
			if (!this.objectExists(o)) {
				this.objects.add(o);
			}
		}, this);
	}
});
