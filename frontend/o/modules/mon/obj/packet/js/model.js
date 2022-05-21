/**
 * Device packet
 * @class O.mon.model.Packet
 * @extends O.mon.model.Coord
 */
C.define('O.mon.model.Packet', {
	extend: 'O.mon.model.Coord',
/**
	* Объект устройства-владельца пакета
	* @type O.mon.model.Device
	* @default null
	*/
	device: null,

/**
	* Мгновенная скорость
	* @type Number
	* @default 0
	*/
	speed: 0,

/**
	* Код события. <br/>
	* <b>Важно!</b> Пока информативен только для AGIS-2.
	* Надо выяснить как для других устройств
	* @type String
	* @default '0'
	*/
	code: '0',

/**
	* Мгновенный азимут
	* @type Number
	* @default 0
	*/
	azimuth: 0,

/**
	* @constructs
	* @param {Object} config Объект конфигурации
	*/
	constructor: function(config) {
		this.callParent(arguments);
		this.time = C.utils.toDate(this.time);
		this.event_dt = C.utils.toDate(this.event_dt);
	},

/**
	* Return field data by packet identifier
	* @param {Number} id Packet identifier
	* @return {Object}
	*/
	getFieldById: function (id) {
		return {
			name: O.convert.fromStore('props', id, 'name'),
			field: O.convert.fromStore('props', id, 'field')
		};
	},

/**
	* Возвращает время пакета в соответствии с UTC-настройками пользователя
	* @param {String} format - формат, в который преобразовать время (не обяз.)
	*/
	getTime: function(format) {
		var time = this.time.pg_utc(C.getSetting('p.utc_value'));
		if (!format) {
			return this.time ? C.utils.fmtDate(time) :
				console.warn('no packets, but LastPacketObtained');
		} else {
			return this.time ? Ext.Date.format(time, format) :
				console.warn('no packets, but LastPacketObtained');
		}
	},

/**
	* Internal odometer
	*/
	getOdometer: function() {
		return this.odometer ? (this.odometer / 1000).toFixed(1) : null;
	},

/**
	* External odometer. Given the user changes.
	*/
	getOdometerExt: function() {
		return this.odometer_ext ? (this.odometer_ext / 1000).toFixed(1)
			: this.getOdometer();
	},

/**
	 * Устанавливает ссылку на устройство, если ее еще не было
	 */
	fetchDevice: function() {
		if (this.device !== null) { return; }
		var devices = C.get('mon_device');
		if (devices) {
			this.device = devices.getByKey(this.id_device);
		}
	},

/**
	* Calculates distance to another packet
	* @param {O.mon.model.Packet} packet Packet object
	*/
	getDistanceTo: function(packet) {
		var dx = this.latitude - packet.latitude;
		var dy = this.longitude - packet.longitude;
		return Math.sqrt(dx * dx + dy * dy);
	},

/**
	* Calculates metric distance to another packet
	* @param {O.mon.model.Packet} packet Packet object
	*/
	getMetricDistanceTo: function(packet) {
		if (!packet || !packet.latitude || !packet.longitude) { return 0; }
		var earthRadius = 6378100;

		var deltaLat = (packet.latitude - this.latitude).toRad();
		var deltaLon = (packet.longitude - this.longitude).toRad();
		var currLat = this.latitude.toRad();
		var endLat = packet.latitude.toRad();

		var angle = Math.sin(deltaLat/2) * Math.sin(deltaLat/2) +
			Math.sin(deltaLon/2) * Math.sin(deltaLon/2) *
			Math.cos(currLat) * Math.cos(endLat);

		var distance = 2 * Math.atan2(Math.sqrt(angle), Math.sqrt(1 - angle));

		return earthRadius * distance;
	},

/**
	* Is moving
	*/
	isMoving: function() {
		return this.speed > 1;
	},

	/**
	 * Is sos packet
	 */
	isSos: function() {
		return this.id_type == C.cfg.packetType.SOS;
	},

	/**
	 * Is StaticPoint packet
	 */
	isStaticPoint: function() {
		return this.id_type == C.cfg.packetType.STATIC_POINT;
	},

/**
	* Get sensor value by it's name
	* If exists returns converted value
	* @param {String} name
	*/
	getSensorValue: function(name) {
		var val = null;
		if (this.sensor !== undefined) {
			Ext.Array.each(this.sensor, function(sensor, index) {
				if (sensor.sensor == name) {
					if (sensor.val_conv) {
						val = sensor.val_conv;
					} else {
						val = sensor.val;
					}
					return false;
				}
			});
		}

		return val;
	},

	/**
	 * Return sensors ready for display
	 * @param nounit Don't use unit
	 * @return Object[]
	 */
	getDisplaySensors: function(nounit) {
		var me = this;
		var device = this.device;
		var sensors = [];
		Ext.Array.each(device.sensor, function(deviceSensor) {

			// Display only sensors with display true
			if (!deviceSensor.display) {
				return true;
			}

			// Get sensor value from packet sensors
			var packetSensor = null;
			Ext.Array.each(me.sensor, function(pSensor) {
				if (pSensor.id_device_sensor == deviceSensor.id) {
					packetSensor = pSensor;
					return false;
				}
			});

			if (!packetSensor) {
				return true;
			}
			// Prepare sensor value
			var val = (packetSensor.val_conv !== null) ?
				packetSensor.val_conv : packetSensor.val;

			var precision = deviceSensor.precision;
			if (precision === null) {
				precision = 2;
			}

			// Round value
			val = parseFloat(parseFloat(val).toFixed(precision));

			// Don't display sensor if value is null
			if (val === null) {
				return true;
			}

			// TODO: replace with C.utils.parseUnit
			// Parse unit if needed
			var unit = deviceSensor.unit;
			if (unit && unit.length) {
				unit = unit.trim();
				var i = unit.indexOf(C.cfg.unitDelimiter);
				if (i !== -1) {
					var splits = [
						unit.slice(0, i).trim(),
						unit.slice(i+1).trim()
					];
				}
			}
			// If unit splitted
			if (splits && splits[0] && splits[1] && splits[0].length
				&& splits[1].length)
			{
				unit = '';
				val = +val === 0 ? splits[1] : splits[0];
			} else {
				if (!unit) {
					unit = '';
				} else {
					unit = ' ' + unit;
				}
			}

			sensors.push({
				name: deviceSensor.name,
				value: val + unit
			});

		});

		return sensors;
	}
});

C.define('Mon.Packet', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
			{name: 'id_device', type: 'int'},
			{name: 'id_type', type: 'int'},
			{name: 'event_dt', type: 'date', dateFormat: 'c'},
			{name: 'latitude', type: 'float'},
			{name: 'longitude', type: 'float'},
			{name: 'altitude', type: 'float'},
			{name: 'azimuth',type: 'int'},
			{name: 'speed', type: 'float'},
			{name: 'odometer', type: 'int'},
			{name: 'address', type: 'string'},
			{name: 'satellitescount', type: 'int'},
			{name: 'hdop', type: 'float'},
			{name: 'state', type: 'int'},
			{name: 'from_archive', type: 'int'},
			{name: 'odometer_forced', type: 'int'},
			{name: 'odometer_calculated', type: 'int'},
			{name: 'odometer_ext', type: 'int'},
			{name: 'time', type: 'date', dateFormat: 'c'},
			{name: 'sensor', type: 'object'},
			{name: 'coordinates', type: 'string',
				convert: function(value, record) {
					return record.get('latitude') + ', '
						+ record.get('longitude');
				}
			}
		]
	}
});
