/**
 * @class O.comp.HistoryPanel
 */
C.utils.inherit('O.comp.HistoryPanel', {
	initComponent: function() {
		this.callOverridden(arguments);
		if (this.mapPacketInfo) {
			this.relayEvents(this.mapPacketInfo, ['coordselected']);
		}
		//user don't loaded data
		this.dataLoaded = false;
		if (this.detailedReport) {
			// Pass summary store to detailedReport
			this.detailedReport.summaryStore = this.summaryStore;
			this.detailedReport.on({
				// click on track
				'itemclick': function(gw, record) {
					this.fireEvent('itemclicked',
						this.detailedReport.getSelectedItems(), record);
				},
				'checkedchange': 'onCheckedChange',
				'dataload': 'onCheckedChange',
				scope: this
			});
		}

		if (this.hidefulltrackBtn) {
			this.hidefulltrackBtn.on('toggle', 'hideFullTrack', this);
		}

		// Sensors settings change
		if (this.historySensors) {
			this.historySensors.on('drawsensors', 'onDrawSensors', this);
		}

		// Exporters
		if (this.btnExportGpx10) {
			this.btnExportGpx10.setHandler(this.exportTrack, this);
		}
		if (this.btnExportGpx11) {
			this.btnExportGpx11.setHandler(this.exportTrack, this);
		}
		if (this.btnExportKml) {
			this.btnExportKml.setHandler(this.exportTrack, this);
		}
	},

/**
	* Exports loaded track
	* @param {Ext.Component} button
	*/
	exportTrack: function(button) {
		if (!this.loadParams) { return; }
		var fmt = button.exportFormat || 'json';
		var deviceId = this.loadParams.deviceId;
		var sdt = Ext.Date.format(this.loadParams.sdt, 'Y-m-d\\TH:i:s\\Z');
		var edt = Ext.Date.format(this.loadParams.edt, 'Y-m-d\\TH:i:s\\Z');
		var filename = 't-' + deviceId + '-' +
			Ext.Date.format(this.loadParams.sdt, 'Y-m-d\\TH-i') + '-to-' +
			Ext.Date.format(this.loadParams.edt, 'Y-m-d\\TH-i') + '.' +
			fmt.substring(0, 3);
		var url = Ext.String.format("/mon_packet?{0}",
			'sort=' + Ext.encode([{property: 'time'}]) + '&' +
			'filename=' + filename + '&' +
			'format=' + fmt + '&' +
			'$filter=id_device eq ' + deviceId +
					' and time ge ' + sdt +
					' and time le ' + edt +
					' and state eq 1'
		);
		window.open(url);
	},

/**
	* Disable displaying of full track
	*/
	hideFullTrack: function(btn) {
		this.fireEvent('togglefulltrack', !btn.pressed);
	},

	getLastSelected: function() {
		return this.detailedReport.getSelectionModel().lastSelected;
	},

/**
	* Gets data from another O.comp.HistoryPanel
	* @param {O.comp.HistoryPanel}
	*/
	getData: function(object) {
		if (!object.isDataLoaded()) {
			return;
		}

		var tracks = object.detailedReport.store.getRange();
		var events = object.deviceEvents.store;

		this.loadDetailedReport(tracks);
		this.loadSensors(tracks);
		this.deviceEvents.down('gridpanel').reconfigure(events);
		this.deviceEvents.down('pagingtoolbar').bindStore(events);
		this.deviceEvents.enable();
	},

/**
	* Need sensors draw
	* @param sensors
	*/
	onDrawSensors: function(sensors) {
		this.fireEvent('drawsensors', sensors);
	},

/**
	* Fires checkedchange, toggles button if needed
	* @param {Object} state State config
	*/
	onCheckedChange: function(selection) {
		this.fireEvent('checkedchange', selection);

		var state = this.detailedReport.getStoppingsState(),
			button = this.down('toolbar').down('#stoppingsBtn'),
			pressed = button.pressed;

		if (state.count > C.cfg.track.maxStoppingsForMassToggle) {
			button.hide();
		} else {
			button.show();
		}

		if (pressed != state.visible) {
			button.toggle(state.visible).setText(state.visible ?
				this.msgBtnHideStoppings : this.msgBtnShowStoppings);
		}
	},

/**
	* Apply window state
	* @param {Object} state State config
	*/
	applyState: function(state) {
		if (state) {
			Ext.apply(this, state);
		}
	},

/**
	* Returns state object to store in StateProvider
	* @return {Object}
	*/
	getState: function() {
		var o = {
			x: this.x,
			y: this.y,
			width: this.width,
			collapsed: this.collapsed
		};
		if (!this.collapsed && this.height) {
			o['height'] = this.height;
		}
		return o;
	},

/**
	* Indicates, when data was loaded to child panels
	*/
	isDataLoaded: function() {
		return this.dataLoaded;
	},

/**
	* Loads events to events tab
	* @param {int} device ID of device
	* @param {object} period Time period to load events
	*/
	loadEvents: function(device, period) {
		this.deviceEvents.loadForPeriod(device, period);
		this.deviceEvents.enable();
	},

/**
	* Loads detailed report to corresponding tab
	* @param {Object[]} data Tracks data
	* return {boolean}
	*/
	loadDetailedReport: function(data) {
		this.detailedReport.loadTracks(data);
		this.dataLoaded = true;
		this.fireEvent('togglefulltrack', !this.hidefulltrackBtn.pressed);
	},

/**
	* Loads sensors to sensors tab
	* @param data Tracks
	*/
	loadSensors: function(data) {
		this.historySensors.lastLoadParams = this.loadParams;
		this.historySensors.loadSensors(this.loadParams, data);
	},

/**
	* When sensors list should be changed because of some updates
	* @param data
	*/
	reloadSensors: function(data) {
		// Something changed and we need to tell tab to reload sensors
		this.historySensors.reloadSensors(data);
	},

/**
	* Отобразить work, вызванный из Popup
	* @param Object work
	*/
	showWork: function(work) {
		this.fireEvent('coordselected', {
			latitude: work.latitude,
			longitude: work.longitude
		});
	}
});
