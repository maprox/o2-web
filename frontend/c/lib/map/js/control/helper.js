/**
 * Load helper class for map engine
 * ===============================
 *
 * Вспомогательный класс для загрузки движка карты (OpenLayers),
 * создания движка карты и геокодера
 *
 * @class C.lib.map.Baselayer
 * @extends C.ui.Panel
 */
Ext.define('C.lib.map.Helper', {
	singleton: true,

	/**
	* Загружает движок карты и геокодера
	*/
	load: function(callback, scope) {
		this.apiLoad(callback, scope);
	},

	/**
	* Возвращает объект геокодера (создается только один раз)
	* @return {C.lib.map.Geocoder}
	*/
	getGeocoder: function() {
		if (this.geocoder == null) {
			this.geocoder = Ext.create(this.getClass('Geocoder'));
		}
		return this.geocoder;
	},

	/**
	* Создает объект движка с картой (можно создать несколько движков)
	* @params {Object} дополнительные параметры движка
	*/
	createEngine: function(params) {
		return Ext.create(this.getClass('Engine'), params);
	},

	/**
	* Загрузка API OpenLayers и активация расширений
	* @param {Function} callback
	* @param {Object} scope
	*/
	apiLoad: function(callback, scope) {
		var extender = this.getClass('Extender');
		C.utils.loadScripts(C.cfg.maps.load, function() {
			if (typeof(ymaps) !== 'undefined') {
				extender.recreate();
				ymaps.ready(function() {
					callback.call(scope, true);
				});
			} else {
				extender.recreate();
				callback.call(scope, true);
			}
		}, false);
	},

	/**
	* Возвращает нужный объект в соответствии с выбранным движком карты
	* @params {String} name имя класса в модуле движка
	*/
	getClass: function(name) {
		var base = C.lib.map;

		return base[C.cfg.maps.engine][name];
	}
});
