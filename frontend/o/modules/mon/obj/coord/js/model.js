/**
 * @fileOverview Класс пакета данных устройства
 *
 * Класс координаты<br/>
 * @class O.mon.model.Coord
 * @extends O.model.Object
 */
C.define('O.mon.model.Coord', {
	extend: 'O.model.Object',

/**
	* Текущая широта местоположения устройства
	* @type Number
	* @default 0
	*/
	latitude: 0,

/**
	* Текущая долгота местоположения устройства
	* @type Number
	* @default 0
	*/
	longitude: 0,

/**
	* Высота над уровнем моря
	* @type Number
	* @default 0
	*/
	altitude: 0,

/**
	* Кеш адреса
	* @type String
	* @private
	*/
	address: null,
/**
	* Кеш адреса
	* @type Boolean
	* @private
	*/
	addressLoaded: false,

/**
	* Функция получения адреса по координате пакета
	* @param {Function} callback Функция обратного вызова
	*/
	getAddress: function(callback) {
		var geocoder = C.lib.map.Helper.getGeocoder();

		if (!Ext.isEmpty(this.address) || !this.id || this.addressLoaded) {
			callback(this.address, this);
			return;
		}

		geocoder.geocode({
			id: this.id
		}, {
			success: function(response) {
				this.address = response.address;
				this.addressLoaded = true;
				callback.call(this, this.address, this);
			},
			scope: this
		});
	},

/**
	* Checks if packet has null (or 0) coordinates
	* @return {Boolean}
	*/
	isEmpty: function() {
		return (!this.latitude && !this.longitude);
	}
});
