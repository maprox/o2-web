/**
 * GClientGeocoder ('google') implementation
 *
 * @class O.map.google.Geocoder
 * @extends C.lib.map.openlayers.Geocoder
 */
Ext.define('C.lib.map.openlayers.Geocoder', {
	extend: 'C.lib.map.Geocoder',

/**
	* Имя движка геокодирования
	* @type String
	*/
	id: 'openlayers',

/**
	* Функция инициализации
	* @return {Boolean} true, если удалось зарегистрировать (или найти)
	*/
	init: function() {
		return true;
	},

/**
	* Запрос информации для геокодирования
	* @param {String/Object} request Запрашиваемые данные
	* @param {Object} callbacks Функции/scope обработки ответа
	*/
	geocode: function(request, callbacks) {
		if (Ext.isEmpty(request)) { return; }

		callbacks = callbacks || {};
		scope = callbacks.scope || this;
		success = callbacks.success || Ext.emptyFn;
		failure = callbacks.failure || this.onFailure;

		Ext.Ajax.request({
			url: '/geocoder',
			params: {
				request: Ext.encode(request)
			},
			scope: this,
			success: function(response) {
				try {
					var response_data = Ext.decode(response.responseText);
					if (response_data.success) {
						success.call(scope, response_data);
					} else {
						failure.call(scope, response_data);
					}
				} catch (e) {
					console.error(e);
					//O.msg.error({msg: e});
				}
			}
		});
	},

/**
	* Default failure handler
	* @param {Mixed[]} response результат запроса
	*/
	onFailure: function(response) {
		//C.lib.Message.warning(C.err.fmtAll(response.errors));
		console.log(C.err.fmtAll(response.errors));
	}
});
