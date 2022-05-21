/**
 *
 * Device waylist window
 * @class O.mon.act.map.Waylist
 * @extends Ext.panel.Panel
 */
C.utils.inherit('O.mon.act.map.Waylist', {

	initComponent: function() {
		this.callParent(arguments);

		C.bind('mon_waylist_route_update', this);
		C.bind('mon_waylist', this);
		C.bind('clock5', this);
	},

	/**
	 * Executes when waylist route is updated
	 * @param {Object[]} data
	 * @private
	 */
	onUpdateMon_waylist_route_update: function(data) {
		this.performDataLoad();
	},

	/**
	 * Executes when waylist is updated
	 * @param {Object[]} data
	 * @private
	 */
	onUpdateMon_waylist: function(data) {
		this.performDataLoad();
	},

	/**
	 * @private
	 */
	onUpdateClock5: function() {
		this.updateNextPoint();
	},

	/**
	 * Sets current device
	 * @param {O.mon.model.Device} device
	 */
	setDevice: function(device) {
		this.currentDevice = device;
	},

	/**
	 * Fires display event
	 */
	displaySchema: function() {
		if (this.currentWaylist) {
			this.fireEvent('display_waylist_schema', this.currentWaylist);
		}
	},

	/**
	 * Loads waylist data by its id
	 * @param {int} id
	 */
	loadDataById: function(id) {
		if (this.currentWaylist == id) {
			return;
		}

		this.setLoading(true);
		this.currentWaylist = id;
		this.waylistLoaded = false;
		this.waylistRouteLoaded = false;

		this.setDataList({});
		this.setDataRoute(new Ext.util.MixedCollection());

		this.performDataLoad();
	},

	performDataLoad: function() {
		var id = this.currentWaylist;
		if (!id) {
			return;
		}

		C.get('mon_waylist', function(response){
			this.waylistLoaded = true;
			this.setDataList(response.getCount() ? response.first() : {});
			this.checkLoadFinished();
		}, this, {'$filter': 'id eq ' + id, '$joined': 1});

		C.get('mon_waylist_route', function(response){
			this.waylistRouteLoaded = true;
			this.setDataRoute(response);
			this.checkLoadFinished();
		}, this, {'$filter': 'id_waylist eq ' + id, '$joined': 1});
	},

	/**
	 * Checks whether all loading is finished
	 */
	checkLoadFinished: function() {
		if (this.waylistLoaded && this.waylistRouteLoaded) {
			this.setLoading(false);
		}
	},

	/**
	 * Sets data for waylist
	 * @param {object} data
	 */
	setDataList: function(data) {
		if (data.serial_num || data.num) {
			var serial = data.serial_num + '/' + data.num;
		} else {
			var serial = '';
		}
		this.down('#serial').setValue(serial);

		if (data.sdt) {
			var date = C.utils.fmtUtcDate(new Date(data.sdt), O.format.Date);
		} else {
			var date = '';
		}
		this.down('#date').setValue(date);

		if (data['id_driver$lastname']
			|| data['id_driver$firstname']
			|| data['id_driver$secondname']) {

			var name = data['id_driver$lastname'] + ' ' +
				data['id_driver$firstname'] + ' ' + data['id_driver$secondname'];
		} else {
			var name = '';
		}
		this.down('#fio').setValue(name);
	},

	/**
	 * Sets data for waylist route
	 * @param {object[]} data
	 */
	setDataRoute: function(data) {
		var totalCount = 0,
			passCount = 0,
			lastPoint,
			nextPoint;

		data.each(function(route){
			totalCount++;
			if (route.enter_dt) {
				passCount++;
			}
			if (route.enter_dt) {
				lastPoint = route;
			}
			if (!route.enter_dt && !nextPoint) {
				nextPoint = route;
			}
		}, this);

		if (totalCount) {
			var completed = passCount + '/' + totalCount;
		} else {
			var completed = '';
		}
		this.down('#completed').setValue(completed);

		if (lastPoint) {
			var lastDt = C.utils.fmtUtcDate(new Date(lastPoint['enter_dt']),
				O.format.DateShort + ' ' + O.format.TimeShort);
			lastPoint = lastPoint['id_point$name'] + ' (' + lastDt + ')';
		} else {
			lastPoint = '';
		}
		this.down('#previous').setValue(lastPoint);

		if (nextPoint) {
			var expectDt = new Date(nextPoint['expect_dt']);
			expectDt.pg_utc(C.getSetting('p.utc_value'));
			this.expectDt = expectDt;
			this.nextPoint = new Mon.WaylistRoute(nextPoint);
		} else {
			this.nextPoint = null;
		}
		this.updateNextPoint();
	},

	/**
	 * Sets data for next point
	 */
	updateNextPoint: function() {
		var field = this.down('#next');

		if (!this.nextPoint || !this.currentDevice) {
			field.setValue('');
			return;
		}

		var text = this.nextPoint.get('id_point$name');
		var packet = this.currentDevice.getLastPacket();
		var textPacket = '';
		var late = this.nextPoint.isLate();
		var textLate = '';

		if (packet) {
			var distance = packet.getMetricDistanceTo({
				latitude: this.nextPoint.get('id_point$center_lat'),
				longitude: this.nextPoint.get('id_point$center_lon')
			});
			if (!isNaN(distance)) {
				textPacket += _('before point') + ' ' + O.convert.distance(distance);
			}
		}
		if (late) {
			var seconds = Math.floor(this.nextPoint.lateBy() / 1000);
			var days = Math.floor(seconds / 86400);
			var hours = Math.floor((seconds % 86400) / 3600);
			var minutes = Math.floor((seconds % 3600) / 60);

			if (days > 0 || hours > 0 || minutes > 0) {
				textLate += _('overdue');
				if (days > 0) {
					textLate += ' ' + days + ' ' + plural(days, 'day')
				}
				if (hours > 0) {
					textLate += ' ' + hours + ' ' + plural(hours, 'hour')
				}
				if (minutes > 0 || days == 0) {
					textLate += ' ' + minutes + ' ' + plural(minutes, 'minute')
				}
			}
		}

		if (textPacket || textLate) {
			text += ' (';
		}
		text += textPacket;
		if (textPacket && textLate) {
			text += ', ';
		}
		text += textLate;
		if (textPacket || textLate) {
			text += ')';
		}

		field.setValue(text);
	}
});
