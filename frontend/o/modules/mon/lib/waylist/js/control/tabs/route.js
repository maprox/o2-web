/**
 * @class O.mon.lib.waylist.tab.Route
 */
C.utils.inherit('O.mon.lib.waylist.tab.Route', {
/**
	* @constructor
	*/
	initComponent: function() {
		this.callOverridden(arguments);
		this.on('recordload', 'onLoadRecord', this);

		if (this.list) {
			this.list.on({
				'route_change': 'onRouteChange',
				'passed_change': 'onPassedChange',
				'route_selected': 'onRouteSelected',
				scope: this
			});
		}
		if (this.fact) {
			this.fact.on('route_selected', 'onRouteSelected', this);
		}
		if (this.map) {
			this.map.on('route_data_calc', 'onRouteDataCalc', this);
		}

		C.bind('mon_packet', this);
	},

/**
	* Record selection handler
	* @param {Ext.Component} cmp
	* @param {O.mon.model.Waylist} record
	*/
	onLoadRecord: function(cmp, record) {
		this.lastRecord = record;
		this.mapFocusNeeded = true;

		if (this.list) {
			this.list.loadByRecord(record);
		}

		if (this.map) {
			this.onMapParamsChange();
		}
	},

	/**
	 * On change of map params: vehicle, sdt, edt
	 */
	onMapParamsChange: function() {
		C.get('mon_device', function(devices){
			var currDevice = false;
			devices.each(function(device){
				if (device.id == this.lastRecord.get('id_vehicle$id_device')) {
					currDevice = device;
				}
			}, this);

			var sdt = this.lastRecord.get('sdt');
			var edt = this.lastRecord.get('edt');

			if (!currDevice || !sdt || !edt) {
				return;
			}

			var filter = 'time ge ' + C.utils.fmtUtcDate(sdt) +
				' and time le ' + C.utils.fmtUtcDate(edt) +
				' and id_device eq ' + currDevice.id;
			var sort = Ext.JSON.encode([{property: 'time'}]);
			C.get('mon_packet', function(packets){
				var data = [];
				packets.each(function(item){
					var packet = new O.mon.model.Packet(item);
					packet.device = currDevice;
					data.push(packet);
				});
				this.map.clearPackets();
				this.map.addPackets(data);
			}, this, {
				'$filter': filter,
				sort: sort,
				'$nolimit': 1,
				'$fields': Ext.JSON.encode(['id', 'latitude', 'longitude',
					'azimuth', 'time', 'speed', 'odometer', 'satellitescount',
					'address'])
			});
		}, this);
	},

	/**
	 * Updating packets
	 * @param {Array} data
	 */
	onUpdateMon_packet: function(data) {
		C.get('mon_device', function(devices){
			var currDevice = false;
			devices.each(function(device){
				if (device.id == this.lastRecord.get('id_vehicle$id_device')) {
					currDevice = device;
				}
			}, this);
			var add = [];
			Ext.each(data, function(packet) {
				if (
					currDevice
					&& this.lastRecord.get('sdt')
					&& this.lastRecord.get('edt')
					&& packet.id_device == currDevice.id
					&& packet.time < this.lastRecord.get('edt')
					&& packet.time > this.lastRecord.get('sdt')
				) {
					packet = new O.mon.model.Packet(packet);
					packet.device = currDevice;
					add.push(packet);
				}
			}, this);

			if (add.length) {
				this.map.addPackets(add);
			}
		}, this);
	},

	/**
	 * On route coordinates change
	 * @param {Object[]} coords
	 * @param {Object} start
	 * @param {Object} end
	 * @private
	 */
	onRouteChange: function(coords, start, end) {
		this.map.setRoutePoints(coords, start, end);
	},

	/**
	 * On route select
	 * @param {Ext.data.Model} record
	 * @private
	 */
	onRouteSelected: function(record) {
		this.map.setCenter(record.get('id_point$center_lat'),
			record.get('id_point$center_lon'));
	},

	/**
	 * On route passed points change
	 * @params {Object[]} records
	 * @private
	 */
	onPassedChange: function(records) {
		this.fact.setData(records);
	},

	/**
	 * On garage select
	 */
	onGarageChange: function() {
		this.list.onGarageChange();
	},

	/**
	 * On route distance calculated change
	 * @params {Number} id
	 * @params {Mixed[]} data
	 * @private
	 */
	onRouteDataCalc: function(id, data) {
		this.list.setCalculatedData(id, data);
	},

	/**
	 * When this tab was selected
	 */
	onSelected: function() {
		if (!this.map) { return; }

		if (this.mapFocusNeeded) {
			this.map.doFocus();
			this.mapFocusNeeded = false;
		}
	}
});
