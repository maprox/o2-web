/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
C.utils.inherit('O.comp.DeviceEvents', {

	/**
	* Текущий объект, чьи события отображаются
	* @integer
	* @private
	*/
	deviceId: null,

/**
	* component Initialization
	*/
	initComponent: function() {
		this.callOverridden(arguments);
	},

/**
	* Алиас для функция загрузки данных за последнее время.
	* Для совместимости.
	* @param {O.mon.model.Device} device Объект устройства
	*/
	load: function(device) {
		this.loadLatest(device);
	},

/**
	* Функция загрузки данных за последнее время (задается в настройках)
	* @param {O.mon.model.Device} device Объект устройства
	*/
	loadLatest: function(device) {

		var hours = C.getSetting('p.eventsperiodlength');
		var utcval = C.getSetting('p.utc_value');
		var end = new Date();
		var begin = Ext.Date.add(new Date(), Ext.Date.HOUR, - parseInt(hours));

		this.store.getProxy().extraParams = {
			objId: device,
			begin: C.utils.fmtDate(begin.pg_utc(utcval)),
			end: C.utils.fmtDate(end.pg_utc(utcval))
		};

		this.store.loadPage(1);

		this.deviceId = device;
		this.period = null;
	},

/**
	* Функция загрузки данных за период
	* @param {O.mon.model.Device} device Объект устройства
	* @param {object} period Период загрузки пакетов
	*/
	loadForPeriod: function(device, period) {

		this.store.getProxy().extraParams = {
			objId: device,
			begin: C.utils.fmtDate(period.sdt),
			end: C.utils.fmtDate(period.edt)
		};

		this.store.loadPage(1);

		this.deviceId = device;
		this.period = period;
	},

/**
	* Возвращает ID последнего заруженного устройства
	*/
	getLastDeviceId: function() {
		return this.deviceId;
	}
});
