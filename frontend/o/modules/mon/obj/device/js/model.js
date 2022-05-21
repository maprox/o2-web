/**
 * Devices class
 * @class O.mon.model.Device
 * @extends O.model.Object
 */
C.define('O.mon.model.Device', {
	extend: 'O.model.Object',
	model: 'Mon.Device',

/**
	* @type String
	* @default ''
	*/
	identifier: '',

/**
	* Connection status of device
	*/
	connected: 0,

/**
	* @type String
	*/
	imagealias: null,

/**
	* <code><pre>
	* {
	* 	id:0,
	* 	latitude:0,
	* 	longitude:0,
	* 	altitude:0,
	* 	speed:0,
	* 	azimuth:0,
	* 	code:'0',
	* 	time:'2009-10-20 8:18:02'
	* }
	* </pre></code>
	* @type Object[]
	* @default []
	*/
	packets: [],

/**
	*
	* @type Ext.util.MixedCollection
	* @private
	*/
	list: null,

/**
	* @constructs
	* @param {Object} config
	*/
	constructor: function(config) {
		this.callParent(arguments);
		this.lastconnect = C.utils.toDate(this.lastconnect);
		this.list = new Ext.util.MixedCollection();
		this.packetsAdd(this.packets);
	},

/**
	*
	* @param {int} id
	*/
	getFieldById: function(id) {
		var obj = Ext.data.StoreManager.lookup('devicePropsStore').getById(id);
		var fname = '';
		var ffield = '';
		if (obj != null) {
			fname = obj.get('name');
			ffield = obj.get('field');
		}
		return {
			name: fname,
			field: ffield
		}
	},

/**
	*
	* @param {int} id
	*/
	isDeviceField: function(id) {
		var store = Ext.data.StoreManager.lookup('devicePropsStore');
		return store ? (store.getById(id) != null) : false;
	},

/**
	*
	* @param {Boolean} desc
	*/
	packetsSort: function(desc) {
		if (typeof(desc) === 'undefined') { desc = true; }
		this.list.sortBy(
			//
			// @param {O.mon.model.Packet}
			// @param {O.mon.model.Packet}
			//
			function(a, b) {
				var l = a;
				var r = b;
				if (desc) {
					l = b;
					r = a;
				}
				return l.time.getTime() - r.time.getTime();
			});
	},

/**
	* @param {Object[]} packets
	* @param {Boolean} sort
	*/
	packetsAdd: function(packets, sort) {
		if (typeof(sort) === 'undefined') { sort = true; }

		if (!packets || !packets.length) { return; }

		for (var i = 0; i < packets.length; i++) {
			var item = packets[i];
			if (!this.list.get(item.id)) {
				var packet = new O.mon.model.Packet(item);
				packet.device = this; // CAN IT BE A MEMORY LEAK?
				this.list.add(packet);
			}
		}

		if (sort) {
			this.packetsSort();
		}

		// Save last normal packet and latest packet
		for (var j = 0; j < this.list.length; j++) {
			if (this.list.getAt(j).state == 1) {
				this.lastNormalPacket = packet;
				break;
			}
		}

		// If no normal packet found, set first packet as normal
		if (!this.lastNormalPacket) {
			this.lastNormalPacket = this.list.first();
			if (this.lastNormalPacket) {
				this.lastNormalPacket.state = 1;
			}
		}

		// Remove packets from tail
		var pointsCount = C.getSetting('p.pointscount');
		if (pointsCount) {
			while (this.list.length > pointsCount) {
				this.list.removeAt(this.list.length - 1);
			}
		}
	},

/**
	* Возвращает последний полученный пакет устройства
	* @param {Boolean} active If true, then only packet with (state = 1)
	* @return O.mon.model.Packet
	*/
	getLastPacket: function(active) {
		if (active === true) {
			return this.lastNormalPacket;
		} else {
			return this.list.first();
		}
	},

/**
	* @param {Function} fn
	* @param {Object} scope
	* @returns {O.mon.model.Device} this
	*/
	each: function(fn, scope) {
		this.list.each(function(packet) {
			return fn.call(scope || this, packet, this);
		}, this);
		return this;
	},

/**
	* Updates internal model with new data
	* @param {Object} data New data
	* @return {Boolean} success flag of operation
	*/
	set: function(data) {
		var result = this.callParent(arguments);
		if (result) {
			Ext.apply(this, data);
			this.lastconnect = C.utils.toDate(this.lastconnect);
		}
		return result;
	},

/**
	* Returns true if device is moving
	* @return Boolean
	*/
	isMoving: function() {
		if (!this.isLost()) {
			var packet = this.getLastPacket();
			return !this.isLost() && packet && packet.isMoving();
		}
		return false;
	},

/**
	* Returns true if device is still
	* @return Boolean
	*/
	isStill: function() {
		if (!this.isLost()) {
			var packet = this.getLastPacket();
			return packet && !packet.isMoving() &&
				(packet.id_type != C.cfg.packetType.STATIC_POINT);
		}
		return false;
	},

/**
	* Returns true if device is lost
	* @return Boolean
	*/
	isLost: function() {
		if (!this.isUnconfigured()) {
			var obj = this.getNoDataObject();
			return obj.nodata;
		}
		return false;
	},

/**
	* Returns true if device is unconfigured
	* @return Boolean
	*/
	isUnconfigured: function() {
		return !this.lastpacket && !this.list.length && !this.lastimage;
	},

/**
	* Returns true if device is connected
	* @return Boolean
	*/
	isConnected: function() {
		var obj = this.getNoDataObject();
		return !obj.noconnection;
	},

/**
	* Returns an object, wich describes timing of last device packet
	* @return {Object}
	*/
	getNoDataObject: function() {
		var packet = this.getLastPacket();
		var packetLatest = this.getLastPacket(false);
		if (!packet || !packetLatest) { return {}; }
		var curTime = O.manager.Model.getServerTime();
		var maxIdle = this.freq_idle ? this.freq_idle : C.cfg.device.freqIdle;
		maxIdle = parseInt(maxIdle) + C.cfg.device.badConnectionGap;

		// Define lastconnect
		var lastConnect;
		if (this.list.length) {
			lastConnect = packet.event_dt;
		}
		if (!lastConnect) {
			lastConnect = this.lastconnect;
		}
		// If camera packet
		if (this.lastimage && packet.id_type == C.cfg.packetType.CAMERA) {
			var img = Ext.decode(this.lastimage);
			var newLastConnect = C.utils.toDate(img.time)

			if (newLastConnect) {
				lastConnect = newLastConnect;
			}
		}
		// no data for more then 40 minutes
		var noConnection = curTime - lastConnect > maxIdle * 1000;
		var noData = curTime - packet.time > maxIdle * 1000;
		if (packetLatest.isStaticPoint()) {
			noConnection = noData = false;
		}

		return {
			curtime: curTime,
			packettime: packet.time,
			noconnection: noConnection,
			nodata: noData
		};
	},

/**
	* Returns lost data string
	* @return {String}
	*/
	getLostDataString: function() {
		var obj = this.getNoDataObject();
		var time = O.timeperiod.formatPeriod(obj.curtime - obj.packettime);
		return time;
	}

});

C.define('Mon.Device', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
			{name: 'id', type: 'int'},
			{name: 'id_firm', type: 'int'},
			{name: 'configured', type: 'int', useNull: true},
			{name: 'connected', type: 'int', useNull: true},
			{name: 'lastpacket', type: 'date', dateFormat: 'c'},
			{name: 'lastconnect', type: 'date', dateFormat: 'c'},
			{name: 'lastnormalpacket', type: 'date', dateFormat: 'c'},
			{name: 'last_configured_change', type: 'date', dateFormat: 'c'},
			{name: 'blockdate', type: 'date', dateFormat: 'c'},
			{name: 'protocol', type: 'int', useNull: true},
			{name: 'identifier', type: 'string'},
			{name: 'name', type: 'string'},
			{name: 'note', type: 'string'},
			{name: 'imagealias', type: 'string'},
			{name: 'lastpacketobtained', type: 'string'},
			{name: 'connection_status'},
			{name: 'fuel_expense', type: 'float', useNull: true},
			{name: 'owner', type: 'int', useNull: true},
			{name: 'odometer', type: 'float', useNull: true},
			{name: 'iseditable', type: 'boolean', defaultValue: true },
			{name: 'isshared', type: 'boolean'},
			{name: 'foreign', type: 'boolean'},
			{name: 'lastimage', type: 'text'},
			{name: 'settings', type: 'text'},
			{name: '$accesslist', type: 'object', persist: false},
			{name: 'settings_modified', type: 'text'},
			{name: 'active_waylist', type: 'int', useNull: true},
			{name: 'state', type: 'int', useNull: true},
			// joined fields
			{name: 'id_vehicle$name', persist: false, type: 'string'},
			{name: 'id_vehicle$car_model', persist: false, type: 'string'},

			// Linked
			{name: 'sensor', type: 'object'}
		]
	}
});

Ext.create('Ext.data.Store', {
	storeId: 'devicePropsStore',
	fields: [
		'id', 'name', 'field', 'type_id'
	],
	data: [
		{id: 88, name: 'Phone', field: 'phone'},
		{id: 65, name: 'Note', field: 'note'},
		{id: 1, name: 'Identifier', field: 'identifier'},
		{id: 0, name: 'Name', field: 'name'}
	],
	proxy: {
		type: 'memory'
	}
});
