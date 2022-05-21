/**
 * Tracks player
 * @class O.mon.trackhistory.TracksPlayer
 * @extends Ext.grid.Panel
 */
C.utils.inherit('O.mon.trackhistory.TracksPlayer', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.tracksplayer',

	/**
	* @constructor
	*/
	initComponent: function() {
		var me = this;
		this.callParent(arguments);

		// Playback speed
		this.playbackSpeed = 1;

		// Min zoom in miliseconds
		this.minRange = 60000;

		// Hidden series
		this.hiddenSeries = [];

		// Set Highcharts options
		// TODO: move it to another place, where?
		Highcharts.setOptions({
			lang: {
				loading: 'Loading...',
				months: ['January', 'February', 'March', 'April', 'May', 'June', _('July'),
						'August', 'September', 'October', 'November', 'December'],
				shortMonths: ['jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', _('Jul'), _('Aug'), 'Sep', 'Oct', 'Nov', 'Dec'],
				weekdays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
				decimalPoint: '.',
				resetZoom: _('Reset zoom'),
				resetZoomTitle: _('Reset zoom'),
				thousandsSep: ','
			}
		});

		// Contols toolbar
		this.controls = this.down('#controls');

		// Timechart panel
		this.timechartPanel = this.down('#timechartPanel');

		// Timeslider
		/*this.timeslider = this.down('#timeslider');
		this.timeslider.on({
			'change': 'onTimeChange',
			'drag': 'onSliderDrag',
			'dragstart': 'onSliderDragStart',
			'dragend': 'onSliderDragEnd',
			scope: this
		});*/

		// Time text
		this.timeText = this.down('#timeText');

		// Play button
		this.btnPlay = this.down('#btnPlay');
		this.btnPlay.on('click', this.onPlay, this);

		// Pause button
		this.btnPause = this.down('#btnPause');
		this.btnPause.on('click', this.onPause, this);

		// Stop button
		this.btnStop = this.down('#btnStop');
		this.btnStop.on('click', this.onStop, this);

		// To start button
		/*this.btnToStart = this.down('#btnToStart');
		this.btnToStart.on('click', this.onToStart, this);

		// To end button
		this.btnToEnd = this.down('#btnToEnd');
		this.btnToEnd.on('click', this.onToEnd, this);*/

		// Skip stoppings button
		this.btnSkipStoppings = this.down('#btnSkipStoppings');
		this.btnSkipStoppings.on('toggle', this.onSkipStoppingsToggle ,this);

		// Follow device
		this.btnFollowSelected = this.down('#btnFollowSelected');
		this.btnFollowSelected.on('toggle', this.onFollowSelectedToggle, this);

		// Playback speed button
		this.playbackSpeedBtn = this.down('#playbackSpeedBtn');

		// Speed menu
		this.speedMenu.on('click', this.onSpeedMenuClick, this);

		// Expand and collapse
		this.on('expand', this.onExpand, this);
		this.on('collapse', this.onCollapse, this);

		// Sensors chart panel
		this.sensorsChartPanel = this.down('#sensorsChartPanel');

		// Packet data panel
		this.packetDataPanel = this.down('history-packetdata');

		// Initial sync  ui
		this.syncUi();
	},

/**
	 * Apply state to panel
	 */
	applyState: function() {
		this.callParent(arguments);
		if (!this.getCollapsed()) {
			this.firstExpand = false;
		}
	},

/**
	 * On expand
	 */
	onExpand: function() {
		if (this.firstExpand && this.tracks) {
			// Load some data
			this.initData();
		}
		this.firstExpand = false;
	},

/**
	 * On collapse
	 */
	onCollapse: function() {
		//
	},

/**
	* Skip stoppings or not
	*/
	isSkipStoppings: function() {
		return this.btnSkipStoppings.pressed;
	},

/**
	 * On follow selected toggle
	 * @param btn
	 * @param pressed
	 */
	onFollowSelectedToggle: function(btn, pressed) {
		this.fireEvent('followselected', pressed);
	},

/**
	 * Initial loading of tracks
	 * @param data Tracks data
	 * @param tracks Tracks models
	 */
	loadTracks: function(data, tracks) {
		// Reset all
		this.resetAll();

		if (!data.length) {
			return;
		}

		// Enable play button
		this.btnPlay.enable();

		// Store tracks
		this.tracks = tracks;

		// Save timeStart and timeEnd
		this.timeStart = this.convertDate(data.first().sdt);
		this.timeEnd = this.convertDate(data.last().edt);

		// Sync ui
		this.syncUi();

		// Init
		this.initTimeChart(data);
		//this.initSlider(data);

		// Sensors chart data request and init
		this.initSensorsChart();

		// If not collapsed
		if (!this.getCollapsed()) {
			// Load init data
			this.initData();
		}
	},

/**
	 * Reset all
	 */
	resetAll: function() {
		this.currentTime = null;

		this.tracks = null;

		// Stop all
		//this.onStop();
		this.startPlay(false);
		this.fireEvent('stop');

		// Hidden sensors chart series
		this.hiddenSeries = [];

		// Destroy time chart
		if (this.timeChart) {
			this.timeChart.destroy();
		}

		// Destroy sensors chart
		if (this.sensorsChart) {
			this.sensorsChart.destroy();
		}

		// Clear packet data
		this.packetDataPanel.clearAll();

		// Disable play button
		this.btnPlay.disable();

		if (!this.getCollapsed()) {
			this.firstExpand = false;
		} else {
			this.firstExpand = true;
		}
	},

/**
	 * Converts string date to date object
	 * @param String date
	 */
	convertDate: function(date) {
		return new Date().pg_fmt(date).pg_utc(C.getSetting('p.utc_value'));
	},

/**
	 * Play button handler
	 */
	onPlay: function() {
		if (this.btnPlay.action == 'play') {
			this.startPlay(true);
		} else {
			this.startPlay(false);
		}
	},

/**
	 * Pause button handler
	 * @deprecated
	 */
	onPause: function() {
		this.startPlay(false);
	},

/**
	 * Stop button handler
	 */
	onStop: function() {
		//this.timeslider.reset();
		this.setCurrentTime(this.timeStart);
		// Fire event
		this.onTimeChange();

		this.startPlay(false);
		this.fireEvent('stop');
	},

/**
	 * To start button handler
	 * @deprecated
	 */
	onToStart: function() {
		//this.timeslider.reset();
		this.updateCharts(this.timeStart);
	},

/**
	 * To end button handler
	 * @deprecated
	 */
	onToEnd: function() {
		//this.timeslider.setValue(this.timeEnd);
		this.updateCharts(this.timeEnd);
		this.startPlay(false);
	},

/**
	 * Start or pause play
	 * @param Boolean play Start or pause
	 */
	startPlay: function(play) {
		this.playing = play;
		//this.btnPause.setVisible(play);
		//this.btnPlay.setVisible(!play);
		this.switchPlayBtn(play);
		if (play) {
			this.getTask().start();
		} else {
			this.getTask().stop();
		}
	},

/**
	 * Switch play or pause btn
	 * @param play
	 */
	switchPlayBtn: function(play) {
		if (play) {
			this.btnPlay.setIconCls('btn-pause');
			this.btnPlay.action = 'pause';
		} else {
			this.btnPlay.setIconCls('btn-play');
			this.btnPlay.action = 'play';
		}
	},

/**
	 * On speed menu click
	 * @param menu
	 * @param item
	 */
	onSpeedMenuClick: function(menu, item) {
		this.playbackSpeedBtn.setText(item.value + 'x');
		this.speedChange(item.value);
	},

/**
	 * On skip stopping
	 * @param btn
	 * @param pressed
	 */
	onSkipStoppingsToggle: function(btn, pressed) {
	},

/**
	 * Changing playback speed
	 * @param speed
	 */
	speedChange: function(speed) {
		this.playbackSpeed = speed;
	},

/**
	 * Returns current running task
	 */
	getTask: function() {
		var interval = 400;
		if (!this.task) {
			var runner = new Ext.util.TaskRunner();
			this.task = runner.newTask({
				interval: interval,
				run: this.updateControls,
				scope: this
			});
		}
		return this.task;
	},

/**
	 * Updates controls by task
	 */
	updateControls: function() {
		if (!this.taskTick) {
			this.taskTick = 0;
		}
		var tick = this.taskTick;
		tick += this.playbackSpeed * (this.getTask().interval / 1000);
		var diff = Math.floor(tick) - Math.floor(this.taskTick);
		if (diff > 0) {
			var newdt = Ext.Date.add(this.getCurrentTime(),
				Ext.Date.SECOND, diff);

			// Check if new date > edt
			if (newdt.getTime() > this.timeEnd.getTime()) {
				// Halt timer
				this.startPlay(false);
				return;
			}

			this.setCurrentTime(newdt);
			// Fire event
			this.onTimeChange();

		}
		this.taskTick = tick;
	},

/**
	 * Sets current time
	 * @param time
	 */
	setCurrentTime: function(time) {
		//this.timeslider.setValue(time);
		this.currentTime = time;
		// Update charts
		this.updateCharts(time);
	},

/**
	 * Returns current time
	 */
	getCurrentTime: function() {
		return this.currentTime || this.timeStart;
	},

/**
	 * Updates charts pointers
	 * @param time
	 */
	updateCharts: function(time) {
		this.updateTimeChartPointer(time);
		this.updateSensorsPointer(time);
	},

/**
	 * Update time chart
	 * @param time
	 */
	updateTimeChartPointer: function(time) {
		if (!this.timeChart || !this.timeChart.chart) {
			return;
		}

		this.timeChart.chart.xAxis[0].removePlotLine('current');
		this.timeChart.chart.xAxis[0].addPlotLine({
			value: time.getTime(),
			width: 1,
			color: 'red',
			id: 'current',
			zIndex: 19
		});
	},

/**
	 * Moves current pointer to given date
	 */
	updateSensorsPointer: function(time) {
		if (!this.sensorsChart || !this.sensorsChart.chart) {
			return;
		}
		this.sensorsChart.chart.xAxis[0].removePlotLine('current');
		this.sensorsChart.chart.xAxis[0].addPlotLine({
			value: time.getTime(),
			width: 1,
			color: 'red',
			id: 'current',
			zIndex: 19
		});
	},

/**
	 * On slider drag
	 * @deprecated
	 */
	onSliderDrag: function() {
		// Update time chart
		//this.updateCharts(this.timeslider.getValue());
	},

/**
	 * On slider drag star
	 * @deprecated
	 */
	onSliderDragStart: function() {
		// Save last playing state
		this.lastPlayStatus = this.playing;

		this.sliderDrag = true;

		// Stop play
		this.startPlay(false);
	},

/**
	 * On slider drag end
	 * @deprecated
	 */
	onSliderDragEnd: function() {

		this.sliderDrag = false;

		// Update time chart
		//this.updateCharts(this.timeslider.getValue());
		// Restore last playing status
		this.startPlay(this.lastPlayStatus);
	},

/**
	 * On time change
	 */
	onTimeChange: function() {
		this.fireEvent('change', this, this.currentTime);
		this.syncUi();
	},

/**
	 * Sync ui
	 */
	syncUi: function() {
		//var dt = this.timeslider.getValue();
		var dt = this.getCurrentTime();
		var val = Ext.Date.format(dt, 'd.m H:i:s');
		this.timeText.setText(val);
	},

/**
	 * Preload some packets
	 */
	initData: function() {
		this.fireEvent('init');
	},

/**
	 * Initialization of time slider
	 * @deprecated
	 */
	initSlider: function(data) {
		var config = {
			timeStart: this.timeStart,
			timeEnd: this.timeEnd
		}

		//this.timeslider.configure(config);

		//this.timeslider.setValue(this.timeStart);
		this.syncUi();
	},

/**
	 * Init sensors chart
	 */
	initSensorsChart: function() {
		// Create chart
		this.loadSensorsChartData(
			this.timeStart, this.timeEnd, this.createSensorsChart, this);
	},

/**
	 * Load sensors chart data for period
	 * @param sdt
	 * @param edt
	 * @param cllback
	 * @param scope
	 */
	loadSensorsChartData: function(sdt, edt, callback, scope) {
		if (!sdt || !edt || !this.getDeviceId()) {
			return;
		}

		this.sensorsChartPanel.setLoading(true);

		Ext.Ajax.request({
			url: '/mon_device_sensor/chartpoints',
			params: {
				id_device: this.getDeviceId(),
				// Remove user's time zone
				sdt: sdt.pg_utc(C.getSetting('p.utc_value'), true),
				edt: edt.pg_utc(C.getSetting('p.utc_value'), true)
			},
			callback: function(opts, success, response) {
				this.sensorsChartPanel.setLoading(false);
				if (!success) { return; }
				// ответ сервера
				var answer = C.utils.getJSON(response.responseText, opts);
				if (answer.success) {
					var points = this.formatPointsData(answer.data);

					if (callback) {
						callback.apply(scope, [points]);
					}
				}
			},
			scope: this
		});
	},

/**
	 * Formats points data
	 * @param data
	 */
	formatPointsData: function(data) {
		var possibleFields = [];
		for (var k = 0; k < data.length; k++) {
			for (var p in data[k]) {
				if (Ext.Array.contains(possibleFields, p) || p == 'time') {
					continue;
				}
				possibleFields.push(p);
			}
		}

		var result = {};

		// Convert times to user time
		for (var i = 0; i < data.length; i++) {
			var time = new Date().pg_fmt(data[i]['time'])
				.pg_utc(C.getSetting('p.utc_value')).getTime();

			// Missing sensors will be added with 0 value
			for (var j = 0; j < possibleFields.length; j++) {

				if (!result[_(possibleFields[j])]) {
					result[_(possibleFields[j])] = [];
				}

				var val = data[i][possibleFields[j]] || 0;
				result[_(possibleFields[j])].push([
					time, val
				]);
			}
		}

		return [result];
	},

/**
	 * Actual draws sensors chart
	 * @param data
	 */
	createSensorsChart: function(data) {
		var player = this;
		var series = [];

		if (!data || !data.length || C.utils.isEmptyObject(data[0])) {
			return;
		}

		// Store fields
		var storeFields = [];

		var possibleFields = [];
		for (var i = 0; i < data.length; i++) {
			for (var p in data[i]) {
				if (Ext.Array.contains(possibleFields, p) || p == 'time'
					|| p == 'currentY' || p == 'current')
				{
					continue;
				}
				possibleFields.push(p);

				series.push({
					color: C.utils.stringToColor(p),
					animation: false,
					dataIndex: _(p),
					name: _(p),
					connectNulls: true
				});
			}
		}

		storeFields = Ext.Array.merge(storeFields, possibleFields);

		// Store
		var store = Ext.create('Ext.data.JsonStore', {
			fields: storeFields,
			data: data
		});

		this.sensorsChartStore = store;


		// Destroy old sensors chart
		if (this.sensorsChart) {
			this.sensorsChart.destroy();
		}

		// Create new chart
		var chart = Ext.create('Chart.ux.Highcharts', {
			//refreshOnChange: true,
			animation: false,
			series: series,
			store: store,
			//height: 100,
			//autoHeight: true,

			// Chart rendered cllback
			afterChartRendered: function() {
				player.onSensorsChartRendered(this)
			},

			chartConfig: {
				chart: {
					marginRight : 230,
					//marginBottom : 120,
					zoomType : 'x',
					defaultSeriesType: 'spline',
					events : {
						selection: function(e) {
							player.onSensorsChartSelection(e)
						},
						click: function(e) {
							player.onChartClick(e);
						}//,
						//load: function(e) {
						//	player.onSensorsChartLoad(this, e);
						//}
					},
					animation: false
				},
				title: false,
				plotOptions: {
					series: {
						connectNulls: true,
						marker: {
							enabled: false
						},
						events: {
							hide: function(e) {
								player.onHideSeries(e);
							},
							show: function(e) {
								player.onShowSeries(e);
							}
						}
					}
				},
				subtitle: false,
				xAxis: {
					type: 'datetime',
					title: false,
					labels: {
						//rotation: 270,
						//y: 65,
						formatter: function() {
							var dt = new Date(this.value);
							if (dt) {
								return Ext.Date.format (dt, "d.m H:i");
							}

							return this.value;
						}
					},
					events: {
						afterSetExtremes: function(e) {
							player.onAfterSetExtremes(e);
						}
					}
				},
				yAxis: {
					title : false,
					min: -1
				},
				tooltip: {
					formatter: function() {
						var dt = new Date(this.x);
						return Ext.Date.format (dt, "d.m H:i:s") + '<br>'
							+ '<span style="font-weight: bold; color:'
							+ this.series.color + '">'
							+ this.series.name + '</span>' + ': ' + this.y;
					},
					animation: false
				},
				legend : {
					layout : 'vertical',
					align : 'right',
					verticalAlign : 'top',
					x : -50,
					borderWidth : 0
				},
				credits : false
			}
		});

		this.sensorsChart = chart;
		this.sensorsChartPanel.insert(chart);
		this.doLayout();
		this.sensorsChartPanel.doLayout();
	},

/**
	 * On hide series
	 * @param e
	 */
	onHideSeries: function(e) {
		// Store hidden series
		if (!Ext.Array.contains(this.hiddenSeries, e.target.name)) {
			this.hiddenSeries.push(e.target.name);
		}
	},

/**
	 * On show series
	 * @param e
	 */
	onShowSeries: function(e) {
		// Remove name from array
		Ext.Array.remove(this.hiddenSeries, e.target.name);
	},

/**
	 * On sensors chart load
	 * @param chart
	 */
	onSensorsChartRendered: function(chart) {
		var me = this;

		// If chart was zoomed before
		if (this.sensorsZoom) {
			// Force display reset zoom button
			if (!chart.resetZoomButton) {
				chart.showResetZoom();

				chart.resetZoomButton.on('click', function(e) {
					me.onResetZoomClick(e)
				}, this);
			}
			chart.resetZoomButton.show();
		}

		var series = chart.series;

		// Hide series from this.hiddenSeries
		for (var i = 0; i < series.length; i++) {
			if (Ext.Array.contains(this.hiddenSeries, series[i].name)) {
				series[i].hide();
			}
		}
	},

/**
	 * On sensors chart load
	 * @param chart
	 * @param e
	 */
	onSensorsChartLoad: function(chart, e) {
		return;
	},

/**
	 * On sensors chart xAxis set extremes
	 */
	onAfterSetExtremes: function(e) {
		return;
	},

/**
	 * On sensors chart selection
	 * @param e
	 */
	onSensorsChartSelection: function(e) {
		var me = this;
		var min = e.xAxis[0].min || e.userMin || e.dataMin;
		var max = e.xAxis[0].max || e.userMax || e.dataMax;

		// Check for too small zoom
		if (max - min < this.minRange) {
			max = min + this.minRange
		}

		var sdt = new Date(min);
		var edt = new Date(max);

		// Prevent actual zoom
		e.preventDefault();

		// Set zoom flag
		this.sensorsZoom = true;

		// Load new data and recreate chart
		this.loadSensorsChartData(
			sdt, edt, function(data) {
				this.createSensorsChart(data);

				// Find data bounds
				// TODO: Kind of kostil because I can't determine a moment
				// when chart is fully loaded to just get an extremes
				var max = null;
				var min = null;

				if (!data || !data.length) {
					return;
				}

				var series = data[0];

				for (var key in series) {
					var s = series[key];
					if (!s || !s.length) {
						continue;
					}

					var first = s[0];
					var last = s[s.length - 1];

					if (!first[0] || !last[0]) {
						continue;
					}

					if (min === null || first[0] < min) {
						min = first[0];
					}

					if (max === null || last[0] > max) {
						max = last[0];
					}
				}

				if (!max || !min) {
					return;
				}

				this.setTimeChartBand(min, max);
			}, this);
	},

/**
	 * On time chart selection
	 * @param e
	 */
	onTimeChartSelection: function(e) {
		this.onSensorsChartSelection(e);
	},

/**
	 * Set band on time chart
	 * @param sdt
	 * @param edt
	 */
	setTimeChartBand: function(sdt, edt) {
		this.timeChart.chart.xAxis[0].removePlotBand('period-band');

		if (!sdt || !edt) {
			return;
		}

		this.timeChart.chart.xAxis[0].addPlotBand({
			from: sdt,
			to: edt,
			color: '#FCFFC5',
			id: 'period-band'
		});
	},

/**
	 * On time or sensors chart click
	 * @param e
	 */
	onChartClick: function(e) {
		// TODO: Kind of kostil
		// Prevent propagating click from reset button
		if (!e.target/* || !e.target.offsetParent 
				|| !e.target.offsetParent.id*/) {
			// Reset button click
			return;
		}

		// Update position
		this.setCurrentTime(new Date(e.xAxis[0].value));
		// Fire event
		this.onTimeChange();
	},

/**
	 * Reload sensors chart
	 * @param data
	 * @depreated TODO: works incorrect when some series does not exists in data
	 */
	updateSensorsChart: function(data) {
		this.sensorsChartStore.removeAll();
		this.sensorsChartStore.loadData(data);
		this.sensorsChart.refresh();
	},

/**
	 * On reset zoom click
	 * @param e
	 */
	onResetZoomClick: function(e) {
		// Hide reset zoom button
		this.sensorsChart.chart.resetZoomButton.hide();

		// Load data for the whole period
		this.loadSensorsChartData(
			this.timeStart, this.timeEnd, this.createSensorsChart, this);

		// Remove band from time chart
		this.setTimeChartBand(null, null);

		// Reset zoom flag
		this.sensorsZoom = false;

		// Stop propagation
		e.stopPropagation();
	},

/**
	 * Returns current device id
	 * @return integer
	 */
	getDeviceId: function() {
		return this.deviceId || null;
	},

/**
	 * Initialize time chart
	 * @param MixedCollection data Tracks
	 * @deprecated
	 */
	initTimeChart: function(data) {

		var player = this;

		if (!data || !data.length) {
			return;
		}

		// Series
		var series = [{
			name: 'moving',
			dataIndex: 'moving',
			lineWidth: 14,
			color: '#00c17d'
		}];

		// Store fields
		var storeFields = [];

		// Moving series data for store
		var movingData = [];

		for (var i = 0; i < data.length; i++) {
			var track = data.getAt(i);

			if (track.type !== 'moving') {
				continue;
			}

			var index = 'series' + i;

			storeFields.push(index);

			// Get sdt
			var trackSdt = this.convertDate(track.sdt);

			// Get edt
			var trackEdt = this.convertDate(track.edt);

			// Track left point
			movingData.push([
				trackSdt.getTime(),
				1
			]);

			// Track right point
			movingData.push([
				trackEdt.getTime(),
				1
			]);

			// Break line
			movingData.push([
				trackEdt.getTime(),
				null
			]);
		}

		// Store
		var store = Ext.create('Ext.data.JsonStore', {
			fields:['moving'],
			data: [{
				'moving': movingData
			}]
		});
		this.timeChartStore = store;

		// Create new chart
		var chart = Ext.create('Chart.ux.Highcharts', {
			//resizable: false,
			//refreshOnChange: true,
			animation: false,
			series: series,
			store: store,
			height: 70,

			// Chart rendered cllback
			afterChartRendered: function() {
				player.onTimeChartRendered(this)
			},

			chartConfig: {
				chart: {
					marginRight: 30,
					marginLeft: 30,
					//reflow: false,
					zoomType: 'x',
					defaultSeriesType: 'spline',
					animation: false,
					events: {
						selection: function(e) {
							player.onTimeChartSelection(e)
						},
						click: function(e) {
							player.onChartClick(e);
						}//,
						//load: function(e) {
						//	player.onSensorsChartLoad(this, e);
						//}
					}
				},
				title: false,
				plotOptions: {
					series: {
						connectNulls: false,
						marker: {
							enabled: false
						}
					}
				},
				subtitle: false,
				xAxis: {
					type: 'datetime',
					title: false,
					// Min zoom
					minRange: 3600000 * 3, // 3 hours
					labels: {
						//rotation: 270,
						//y: 65,
						formatter: function() {
							var dt = new Date(this.value);
							if (dt) {
								return Ext.Date.format (dt, "d.m H:i");
							}

							return this.value;
						}
					}
				},
				yAxis: {
					title: false,
					min: 0,
					max: 2,
					startOnTick: false,
					endOnTick: false,
					labels: {
						enabled: false
					}
				},
				tooltip: false,
				legend: false,
				credits : false
			}
		});

		// Destroy existing chart
		if (this.timeChart) {
			this.timeChart.destroy();
		}
		this.timeChart = chart;

		// Insert new chart
		this.timechartPanel.insert(6, chart);
	},

/**
	* On time chart rendered
	*/
	onTimeChartRendered: function(chart) {
		return;
	}
});