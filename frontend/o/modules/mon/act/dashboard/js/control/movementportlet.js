/**
 * TODO: comment this;
 */
C.utils.inherit('O.mon.act.dashboard.MovementPortlet', {

	initComponent: function() {
		this.callParent(arguments);

		// Init demo data
		this.total = 30;
		this.moving = 18
		this.still = 8;
		this.connected = 26;

		C.bind('mon_packet', this);

		C.bind('clock5', this);
	},

	/**
	 * On mon_packet updates
	 */
	onUpdateMon_packet: function(data) {
		//this.setMovementData();
	},

	/**
	* Updates clock
	*/
	onUpdateClock5: function() {
		this.setMovementData();
	},

/**
	* Return current movement data
	*/
	setMovementData: function() {
		var me = this;

		//C.get('mon_device', function(devices) {



			// Some is going still wich chance 1 / 6
			var goStill = 0;
			if (Math.floor(Math.random() * 12) + 1 == 12) {
				goStill = Math.floor(Math.random() * 4) + 1;
			}
			me.moving = me.moving - goStill;
			me.still = me.still + goStill;

			// Some devices go offline with chance 1/6
			var goOffline = 0;
			if (Math.floor(Math.random() * 18) + 1 == 18) {
				goOffline = Math.floor(Math.random() * 2) + 1;
				if (goOffline % 2) {
					goOffline = -goOffline;
				}
			}

			me.connected = me.connected - goOffline;

			// Some go online or offline in moving or still state
			if (goOffline % 2) {
				me.moving = me.moving - goOffline;
			} else {
				me.still = me.still - goOffline;
			}

			// Reset
			if (me.connected < 20
				|| me.still > 16
				|| me.connected >= me.total)
			{
				me.total = 30;
				me.moving = 18
				me.still = 8;
				me.connected = 26;
			}


			var data = {
				date: new Date(),
				moving: me.moving,
				connected: me.connected,
				still: me.still//,
				//total: total
			}

			// Real data
			/*devices.each(function(device) {
				//var addTotal = false;
				if (device.isMoving()) {
					data.moving = data.moving + 1;
					//addTotal = true;
				}

				if (device.isConnected()) {
					data.connected = data.connected + 1;
					//addTotal = true;
				}

				if (device.isStill()) {
					data.still = data.still + 1;
					//addTotal = true;
				}

				//if (addTotal) {
				//	data.total = data.total + 1;
				//}
			});*/




			var timeAxis = me.chart.axes.get(1);
			var toDate = timeAxis.toDate,
			lastDate = data.date,
			markerIndex = me.chart.markerIndex || 0;

			// If first run set time axis
			if (!me.firstRun) {
				timeAxis.fromDate = data.date;
				timeAxis.toDate = Ext.Date.add(
					new Date(),
					Ext.Date.MINUTE, 5
				);
				me.firstRun = true;
			}

			// If get to chart corner move time axis
			if (+toDate < +lastDate) {
				markerIndex = 1;

				var diff = +lastDate - +toDate;

				timeAxis.toDate = lastDate;
				timeAxis.fromDate = new Date(+timeAxis.fromDate + diff);

				me.chart.markerIndex = markerIndex;
			}

			// Append data to store
			var range = me.chartStore.getRange();
			range.push(data);
			me.chartStore.loadData(range);
		//});
	}
});
