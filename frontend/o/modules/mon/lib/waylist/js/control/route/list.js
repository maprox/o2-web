/**
 * @class O.mon.lib.waylist.RouteList
 */
C.utils.inherit('O.mon.lib.waylist.RouteList', {
/**
	* @constructor
	*/
	initComponent: function() {
		this.callOverridden(arguments);
		// let's disable "t.maxcountofmon_waylist_route" checking
		this._maxCountOfEntities = C.cfg.defaultMaxCountOfEntities;
		// init user interface (show edit button)
		this.btnOnOff.setVisible(false);
		this.btnEdit.setVisible(true);

		this.btnCalculate.setHandler(this.calculateRoutes, this);

		C.bind('mon_waylist_route_update', this);
		C.bind('mon_waylist', this);

		this.bindStoreEvents();
	},

	/**
	 * Executes when warehouse list is updated
	 * @param {Object[]} data
	 * @private
	 */
	onUpdateMon_waylist_route_update: function(data) {
		// Do not update while user is editing
		if (this.isEditing()) {
			return;
		}

		// Suspend loader
		this.suspendLoader();
		this.loadFiltered();
		// Resume loader
		this.resumeLoader();

		this.onDataChange();
	},

	/**
	 * Executes when waylist is updated
	 * @param {Object[]} data
	 * @private
	 */
	onUpdateMon_waylist: function(data) {
		this.onDataChange();
	},

	/**
	 * On garage select
	 */
	onGarageChange: function() {
		this.lastCoords = null;
		this.onDataChange();
	},

	/**
	 * Executes when data was changed
	 * @param {Ext,data.Store} store
	 * @private
	 */
	onDataChange: function(store) {
		store = store || this.gridStore;

		if (!store || !this.waylistRecord) { return; }

		var coords = [];
		store.each(function(record){
			var lat = record.get('id_point$center_lat');
			var lon = record.get('id_point$center_lon');
			if (lat && lon) {
				coords.push({lat: lat, lon: lon,
					id: record.get('id'), name: record.get('num') + ''});
			} else {
				coords.push(false);
			}

			if (record.get('distance_km')) {
				record.set('distance', record.get('distance_km') * 1000);
			}
		});

		var s_point = this.waylistRecord.get('s_point');
		var e_point = this.waylistRecord.get('e_point');

		if (
			!coords.equals(this.lastCoords)
			|| this.lastStart != s_point
			|| this.lastEnd != e_point
		) {
			this.lastCoords = coords;
			this.lastStart = s_point;
			this.lastEnd = e_point;

			var s_coord = false;
			var e_coord = false;

			C.get('mon_geofence', function(points){
				points.each(function(point){
					if (point.id == s_point && point.is_garage) {
						s_coord = {lat: point.center_lat,
							lon: point.center_lon};
					}
					if (point.id == e_point && point.is_garage) {
						e_coord = {lat: point.center_lat,
							lon: point.center_lon};
					}
				});
			}, this);

			this.fireEvent('route_change', coords, s_coord, e_coord);
		}

		var passedRoutes = [];
		store.each(function(record){
			if (record.isCleared()) {
				passedRoutes.push(record);
			}
		});

		this.fireEvent('passed_change', passedRoutes);
	},

	/**
	 * Grid selection handler
	 */
	onGridSelect: function() {
		this.callParent(arguments);
		this.fireEvent('route_selected', this.getSelectedRecord());
	},

/**
	* Loads data for waylist
	* @param {Ext.data.Model} record
	*/
	loadByRecord: function(record) {
		if (this.waylistRecord && this.waylistRecord.getId() === record.getId()) {
			return;
		}

		if (record.getId()) {
			this.waylistRecord = record;
			this.addFilter('id_waylist', record.getId());
			// rebind events, store was swapped
			this.bindStoreEvents();
		}

		this.lastCoords = null;
		this.onDataChange();
	},

	bindStoreEvents: function() {
		this.gridStore.on({
			datachanged: this.onDataChange,
			update: this.onDataChange,
			write: this.onWrite,
			scope: this
		});
	},

	onWrite: function() {
		this.loadFiltered();
	},

	/**
	 * Synchronizes ui
	 * @protected
	 */
	syncUi: function() {
		this.callParent(arguments);

		if (!this.waylistRecord) {
			this.btnCalculate.disable();
			return;
		}

		var sdt = this.waylistRecord.get('sdt'),
			edt = this.waylistRecord.get('edt'),
			idDevice = this.waylistRecord.get('id_vehicle$id_device');

		if (idDevice && sdt && edt && (new Date() > sdt)) {
			this.btnCalculate.enable();
		} else {
			this.btnCalculate.disable();
		}
	},

	/**
	 * Calculates routes by device packets
	 */
	calculateRoutes: function() {
		if (this.gridStore.count()) {
			O.msg.confirm({
				msg: _('Automated calculation will undo already created routes.'
					+ ' Proceed?'),
				fn: function(choice) {
					if (choice === 'yes') {
						this.doCalculateRoutes();
					}
				},
				scope: this
			});
		} else {
			this.doCalculateRoutes();
		}
	},

	/**
	 * Performs route calculation
	 */
	doCalculateRoutes: function() {
		this.lock();
		var utc = C.getSetting('p.utc_value'),
			num = 1,
			sdt = this.waylistRecord.get('sdt'),
			edt = this.waylistRecord.get('edt'),
			idDevice = this.waylistRecord.get('id_vehicle$id_device'),
			idWaylist = this.waylistRecord.get('id'),
			lastTime = sdt,
			filter = 'id_device eq ' + idDevice +
				' and sdt le ' + C.utils.fmtDate(edt) +
				' and sdt ge ' + C.utils.fmtDate(sdt);

		C.get('mon_geofence', function(points){
			C.get('mon_geofence_presence', function(data){
				var route = [],
					entered = false;

				data.each(function(presence){
					presence.sdt = new Date().pg_fmt(presence.sdt);
					if (points.indexOfKey(presence.id_geofence) == -1) {
						return;
					}

					if (presence.state == 0 && entered !== false
						&& entered.id_geofence == presence.id_geofence) {
						console.log(lastTime);
						console.log(entered.sdt);
						route.push({
							num: num,
							id_point: presence.id_geofence,
							time_way: this.formatToInterval(
								(entered.sdt.getTime() - lastTime.getTime())
									/ 1000) + ':00',
							enter_dt: C.utils.fmtDate(entered.sdt),
							time_stay: this.formatToInterval(
								(presence.sdt.getTime() - entered.sdt.getTime())
									/ 1000) + ':00',
							id_waylist: idWaylist
						});
						lastTime = presence.sdt;
						num++;
						entered = false;
						return;
					}

					if (presence.state == 1) {
						entered = presence;
					}
				}, this);

				var deleteIds = [];
				this.gridStore.each(function(record){
					deleteIds.push(record.get('id'));
				});
				this.replaceRoutes(deleteIds, route);
			}, this, {
				'$filter': filter
			});
		}, this);

	},

	/**
	 * Replaces existing mon_waylist routes with new ones
	 * @param deleteIds
	 * @param routes
	 */
	replaceRoutes: function(deleteIds, routes) {
		var baseParams = {
			url: '/mon_waylist_route/',
			scope: this,
			success: function(result) {
				this.replaceRoutes(deleteIds, routes);
			},
			failure: function(result) {
				this.replaceRoutes(deleteIds, routes);
			}
		};

		var deleteId = deleteIds.shift();
		if (deleteId) {
			Ext.Ajax.request(Ext.apply({
				params: {id: deleteId},
				method: 'DELETE'
			}, baseParams));
			return;
		}

		var route = routes.shift();
		if (route) {
			Ext.Ajax.request(Ext.apply({
				params: route,
				method: 'POST'
			}, baseParams));
			return;
		}

		this.loadFiltered();
	},

/**
	* Returns a new record.
	* Can be overwritten by childs
	* @protected
	*/
	getNewRecordConfig: function() {
		var data = {
			'id_waylist': this.waylistRecord.getId(),
			'num': 1
		};
		var last = this.gridStore.last();
		if (last) {
			data['num'] = last.get('num') + 1;
		}

		return data;
	},

	/**
	 * Distance for route was calculated, set if null
	 * @params {Number} id
	 * @params {Mixed[]} data
	 */
	setCalculatedData: function(id, data) {
		this.gridStore.each(function(record){
			var save = false;
			var changes = {};
			if (record.get('id') == id) {

				if (!record.get('distance') && data.distance) {
					changes['distance'] = data.distance;
					save = true;
				}
				if (!record.get('time_way') && data.time) {
					changes['time_way'] = this.formatToInterval(data.time);
					save = true;
				}

				if (save) {
					record.set(changes);
					this.save(record);
				}

				return false;
			}
		}, this);
	},

	/**
	 * @param seconds
	 * @return {String}
	 */
	formatToInterval: function(seconds) {
		var hours = Math.floor(seconds / 3600) + '';
		var minutes = Math.floor((seconds % 3600) / 60) + '';
		if (hours.length < 2) {
			hours = '0' + hours;
		}
		if (minutes.length < 2) {
			minutes = '0' + minutes;
		}
		return hours + ':' + minutes;
	}
});
