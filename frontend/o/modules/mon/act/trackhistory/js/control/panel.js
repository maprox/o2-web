/**
 * @class O.act.TrackHistory
 */
C.utils.inherit('O.act.TrackHistory', {
/**
	* @constructor
	*/
	initComponent: function() {
		this.callOverridden(arguments);
		if (this.groupsList) {
			this.groupsList.on({
				checkchange: 'onSelectionChange',
				selectionchange: 'onSelectionChange',
				scope: this
			});
		}
		if (this.periodchooser) {
			this.periodchooser.on('load', 'loadTracking', this);
		}
		this.on('afterrender', 'onAfterRender', this)

		this.lastSelected = [];

		// Bind
		C.bind('mon_device', this);
		// TODO: using mon_device_sensor probably is correct way
		// but difficult to implement now
		//C.bind('mon_device_sensor', this);
		C.bind('mon_device_sensor_history_setting', this);
	},

/**
	* Handler for afterrender event
	* @private
	*/
	onAfterRender: function() {
		this.historyWindow = Ext.create('O.comp.HistoryWindow', {
			stateId: 'w_trackhistory'
		});
		this.historyPanel = this.down('historypanel');

		// Get tracks player
		this.tracksPlayer = this.down('tracksplayer');
		this.tracksPlayer.on('change', this.onPlayerChange, this);
		this.tracksPlayer.on('stop', this.onPlayerStop, this);
		this.tracksPlayer.on('init', this.onPlayerInit, this);
		this.tracksPlayer.on('collapse', this.onPlayerCollapse, this);
		this.tracksPlayer.on('followselected', this.onFollowSelected, this);

		// Get packet data panel
		this.packetData = this.down('history-packetdata');

		if (Ext.state.Manager.get('trackhistoryPanelCollapsed')) {
			this.setInactiveHistory(this.historyWindow);
			this.setActiveHistory(this.historyPanel);
		} else {
			this.setInactiveHistory(this.historyPanel);
			this.setActiveHistory(this.historyWindow);
		}

		this.up('tabpanel').on('tabchange', 'onParentPanelChanged', this);
	},

/**
	* Shows and adds listeners to history object
	* @param {O.comp.HistoryPanel} object
	*/
	setActiveHistory: function(object) {
		if (!object) { return; }
		object.on({
			checkedchange: 'onTrackItemSelect',
			drawsensors: 'onDrawSensors',
			togglefulltrack: 'onToggleFullTrack',
			itemclicked: 'onItemClick',
			coordselected: 'onPacketFocus',
			collapse_panel: 'onWindowCollapse',
			unfold: 'onWindowUnfold',
			scope: this
		});
		object.show();
		this.activeHistory = object;
	},

/**
	* Add some event handlers in afterrender event handler
	* Hides and clear listeners for history object
	* @param {O.comp.HistoryPanel} object
	*/
	setInactiveHistory: function(object) {
		if (!object) { return; }
		object.un({
			checkedchange: this.onTrackItemSelect,
			//drawsensors: this.onDrawSensors,
			itemclicked: this.onItemClick,
			coordselected: this.onPacketFocus,
			collapse_panel: this.onWindowCollapse,
			unfold: this.onWindowUnfold,
			scope: this
		});
		object.hide();
	},

/**
	* When window signals 'collapse' render it to device list
	*/
	onWindowCollapse: function() {
		Ext.state.Manager.set('trackhistoryPanelCollapsed', true);
		this.historyPanel.getData(this.historyWindow);
		this.setInactiveHistory(this.historyWindow);
		this.setActiveHistory(this.historyPanel);
	},

/**
	* When window signals 'unfold' render it back to map
	*/
	onWindowUnfold: function() {
		Ext.state.Manager.set('trackhistoryPanelCollapsed', false);
		this.historyWindow.getData(this.historyPanel);
		this.setInactiveHistory(this.historyPanel);
		this.setActiveHistory(this.historyWindow);
	},

/**
	* Hide history window on parent panel changed
	*/
	onParentPanelChanged: function(panel, newCard) {
		if (newCard != this) {
			this.historyWindow.hide();
		} else {
			this.activeHistory.show();
		}
	},

/**
	* On toggle fulltrack
	*/
	onToggleFullTrack: function(show) {
		this.mapBaseLayer.toggleHistoryPath(!!show);
	},

/**
	* When mon device updates
	* @param {Object[]} data
	* @private
	*/
	onUpdateMon_device: function(data) {
		// Reload sensors
		if (!data) {
			return;
		}

		if (!data.length) {
			return;
		}

		if (!this.activeHistory || !this.activeHistory.loadParams) {
			return;
		}

		// Check if update for selected device
		if (data[0].id !== this.activeHistory.loadParams.deviceId) {
			return;
		}

		this.activeHistory.reloadSensors(data);
	},

/**
	* When mon device sensor hitory setting updates
	* @param {Object[]} data
	* @private
	*/
	onUpdateMon_device_sensor_history_setting: function(data) {
		if (!data) {
			return;
		}

		if (!data.length) {
			return;
		}

		if (!this.activeHistory || !this.activeHistory.loadParams) {
			return;
		}

		var settingSensor = data[0];

		// Check if sensor setting related to selected device
		var deviceStore = C.getStore('mon_device');
		var device = deviceStore.getById(
			this.activeHistory.loadParams.deviceId);
		if (!device) {
			return;
		}
		var settingSensorId = settingSensor.id_device_sensor;
		var sensors = device.get('sensor');
		if (!sensors) {
			return;
		}
		var exists = false;
		Ext.each(sensors, function(s) {
			if (s.id === settingSensorId) {
				exists = true;

				// break
				return false;
			}
		});
		if (!exists) {
			return;
		}

		// Check if data actually changed to not reload data in same window
		var currentSettings =
			this.activeHistory.historySensors.gridStore.getRange();

		var needReload = true;
		Ext.each(currentSettings, function(setting) {
			if (setting.get('id') === settingSensor.id) {
				needReload = false;
				// Check if nothing changed
				if (setting.data.condition != settingSensor.condition) {
					needReload = true;
				}

				if (setting.data.display != settingSensor.display) {
					needReload = true;
				}

				if (+setting.data.value != +settingSensor.value) {
					needReload = true;
				}

				return false;
			}
		});

		if (!needReload) {
			return;
		}

		this.activeHistory.reloadSensors(data);
	},

/**
	* On draw sensors
	* @param Store sensors Store with sensors settings
	*/
	onDrawSensors: function(sensors) {
		// Set last sensors
		this.lastSensors = sensors;

		if (!this.lastSelected || !this.lastSelected.length) {

			// Display notice
			this.activeHistory.historySensors.displayNotice();
		} else {
			this.activeHistory.historySensors.hideNotice();
		}

		this.mapBaseLayer.drawSensors(sensors, this.lastSelected);
	},

/**
	 * On player collapse
	 */
	onPlayerCollapse: function() {
		// nothing
	},

/**
	 * When player ready to work
	 */
	onPlayerInit: function() {
		var me = this;

		var tracks = this.activeHistory.detailedReport.store.getRange();

		if (!tracks) {
			return;
		}

		// Init follow selected
		var follow = this.tracksPlayer.btnFollowSelected.pressed;
		this.mapBaseLayer.followSelected = follow;

		// Preload packets for first track
		tracks[0].getPackets(function(packets) {
			//
		}, function() {
			//
		});
	},

/**
	 * On player collapse
	 */
	onPlayerStop: function() {
		// Clear device from map
		this.clearPlayerObjects();
	},

/**
	* On player position change
	*/
	onPlayerChange: function(tracksPlayer, time) {
		var me = this;
		// Draw object position
		var devices = this.mapBaseLayer.getDevices();
		if (devices.getCount() == 0) {
			return;
		}

		var deviceId = devices.keys[0];
		var device = devices.getAt(0);

		// Find track time belongs to
		var track = this.getTrackByTime(time);

		if (!track) {
			return;
		}

		var tracks = this.activeHistory.detailedReport.store.getRange();

		if (track && track.isSleep() && this.tracksPlayer.isSkipStoppings()) {
			// Move player to begining of the next track another position

			var nextTrack = tracks[track.index + 1];

			if (!nextTrack) {
				return;
			}

			this.tracksPlayer.setCurrentTime(nextTrack.get('sdt'));

			return;
		}

		if (!track.isSleep()) {
			if (!track.packetsLoaded) {
				// Load packets for track
				this.lock();
				track.getPackets(function(packets) {
					// Draw device
					this.drawDevice(time, track);

					this.unlock();
				}, function() {
					// Failure
					this.unlock();
				}, this);
			} else {
				this.drawDevice(time, track);
			}
		} else {
			// Sleep track
			// Load packets for prev track
			var prevTrack = tracks[track.index - 1];

			if (!prevTrack) {
				return;
			}
			if (!prevTrack.packetsLoaded) {
				this.lock();
				prevTrack.getPackets(function(packets) {
					// Display device in last point
					this.mapBaseLayer.drawPlayerDevice(
						device, prevTrack.packets[prevTrack.packets.length - 1]
					);

					this.unlock();
				}, function() {
					// Failure
					this.unlock();
				}, this);
			} else {
				// Display device in last point
				this.mapBaseLayer.drawPlayerDevice(
					device, prevTrack.packets[prevTrack.packets.length - 1]
				);
			}
		}
	},

/**
	 * On follow selected
	 */
	onFollowSelected: function(follow) {
		this.mapBaseLayer.followSelected = follow;
	},

/**
	 * Clears player objects - device, movement arrow
	 */
	clearPlayerObjects: function() {
		this.mapBaseLayer.clearPlayerDevice();
		this.mapBaseLayer.clearMovementArrow();
	},

	/**
	 * Draws device on map by time
	 * @param time
	 * @param track
	 */
	drawDevice: function(time, track) {

		var devices = this.mapBaseLayer.getDevices();
		if (devices.getCount() == 0) {
			return;
		}

		var deviceId = devices.keys[0];
		var device = devices.getAt(0);

		var points = [];
		for (var i = 0; i < track.packets.length; i++) {
			var packet = track.packets[i];

			// Add timezone to packet time
			var packetTime = packet.time.pg_utc(C.getSetting('p.utc_value'));

			if (packetTime.getTime() <= time.getTime()) {
				points.push(packet);
			}
		}

		var curPacket = points[points.length - 1];
		//this.mapBaseLayer.drawPlayerTrack(device, time, points);
		this.mapBaseLayer.drawPlayerDevice(device, curPacket);

		// TODO: move it from draw device or rename draw device
		// Set packet data
		this.packetData.setPacket(curPacket);
	},

/**
	 * Returns track by time
	 * @param time
	 */
	getTrackByTime: function(time) {

		var tracks = this.activeHistory.detailedReport.store.getRange();

		if (!tracks) {
			return null;
		}

		var actualTrack = null;
		for (var i = 0; i < tracks.length; i++) {
			var track = tracks[i];

			if (time.getTime() >= track.get('sdt').getTime()
				&& time.getTime() <= track.get('edt').getTime())
			{
				actualTrack = track;
				break;
			}
		}

		return actualTrack;
	},

/**
	* Обработать событие "Выбран элемент истории поездок"
	*/
	onTrackItemSelect: function(selection) {
		// Update summary info
		var summaryStore = this.activeHistory.summaryStore;
		var record = summaryStore.getAt(0);

		if (selection) {
			var odometerSelected = 0;
			Ext.each(selection, function(item) {
				if (item.get('type') == 'moving') {
					odometerSelected += item.get('odometer');
				}
			});
			if (record) {
				record.set('odometer_selected', odometerSelected);
			}
			this.historyWindow.summaryView.refresh();
		}

		// New item checked (lastItem)
		if (this.lastSelected) {
			Ext.each(selection, function(item) {
				if (!Ext.Array.contains(this.lastSelected, item)) {
					this.lastItem = item;
				}
			}, this);
		}
		this.lastSelected = selection;

		var needPreload = false;
		var needDraw = [];

		// Check if we need load packets first
		Ext.each(selection, function(track) {
			if (!track.packetsLoaded && !track.isSleep()) {
				needPreload = track;
				return false;
			}
			if (track.isSleep() || track.packets.length > 0) {
				needDraw.push(track);
			}
		});
		// If packets already loaded
		if (needPreload === false) {
			var toCenter = (this.lastItem != null);
			this.mapBaseLayer.drawSelectedTracks(needDraw, toCenter, this.lastItem);
			this.lastItem = null;

			// Draw sensors
			this.onDrawSensors(this.lastSensors);

			this.unlock();
		// Else load packets
		} else {
			this.lock();
			needPreload.getPackets(function(){
				this.onTrackItemSelect(selection);
			}, function(){
				this.unlock();
			}, this);
		}
	},

/**
	* History element click handler
	*/
	onItemClick: function(selection, lastItem) {
		if(lastItem.get('visible') == true) {
			this.lastItem = lastItem;
			this.onTrackItemSelect(selection);
		}
	},

/**
	* Загрузка данных о треках выбранных устройств за выбранный период
	*/
	loadTracking: function(period, resultCallback) {
		// Pass period to the history window
		if (this.historyPanel) {
			this.historyPanel.period = period;
			this.historyWindow.period = period;
		}

		// Pass period to tracks player
		if (this.tracksPlayer) {
			this.tracksPlayer.period = period;
		}

		var devices = this.mapBaseLayer.getDevices();
		if (devices.getCount() == 0) {
			return;
		}

		var loadParams = {
			deviceId: devices.keys[0],
			sdt: period.sdt,
			edt: period.edt
		};

		this.activeHistory.show();
		this.activeHistory.loadParams = {
			deviceId: devices.keys[0],
			sdt: period.sdt,
			edt: period.edt
		};
		// Pass load params
		if (this.historyPanel) {
			this.historyPanel.loadParams = loadParams;
			this.historyWindow.loadParams = loadParams;
		}

		this.historyWindow.disable();
		this.lock();
		this.activeHistory.loadEvents(devices.keys[0], period);

		C.get('mon_track', this.onTrackLoad, this,
			{'$filter': 'sdt ge ' + C.utils.fmtUtcDate(period.sdt) +
				' and edt le ' + C.utils.fmtUtcDate(period.edt) +
				' and id_device eq ' + devices.keys[0]}
		);

		resultCallback(true);

		//mapLayer.loadTracking(period, resultCallback);
	},

/**
	* Заполнение грида с информацией о треках, после загрузки
	* @param {Ext.util.MixedCollection} data Tracks data
	*/
	onTrackLoad: function(data) {
		data.sort('sdt');
		data = this.doHistoryTrack(data);

		this.activeHistory.loadDetailedReport(data.getRange());;
		this.activeHistory.loadSensors(data.getRange());
		this.activeHistory.resetShowStoppings();
		this.historyWindow.enable();

		// Load tracks to tracks player
		if (this.tracksPlayer) {
			this.tracksPlayer.deviceId = this.activeHistory.loadParams.deviceId;
			var tracks = this.activeHistory.detailedReport.store.getRange();
			this.tracksPlayer.loadTracks(data, tracks);
		}
	},

/**
	* Очистка списка пакетов и истории поездок, выдача сообщения об отсутствии
	* даных
	*/
	clearControls: function() {
		this.unlock();
		this.activeHistory.enable();
		this.activeHistory.loadDetailedReport([]);
		this.activeHistory.loadSensors([]);
		if (this.speedGraph) {
			this.speedGraph.loadPackets([]);
		}
		O.msg.info(this.lngEmptyPeriod);
	},

/**
	* Отрисовка треков устройств после получения ответа от сервера
	* @param {Ext.util.MixedCollection} tracks
	*/
	doHistoryTrack: function(tracks) {
		this.mapBaseLayer.clearHistroryData();

		if (tracks.length == 0) {
			this.clearControls();
			return tracks;
		}

		var devices = this.mapBaseLayer.getDevices();
		var device;
		var drawTracks = [];

		tracks.each(function(track) {
			if (!device) {
				device = devices.get(track.id_device);
			}

			var coord = this.createPacketModels(device, track.track);

			if (coord[0]) {
				track.start_point = coord[0];
			}

			if (track.type == Mon.Track._SLEEP || coord.length == 0) {
				return;
			}

			//Создаем массив пакетов
			drawTracks.push({
				points: coord,
				type: track.type
			});
		}, this);

		this.mapBaseLayer.drawHistoryPath(device, drawTracks);

		this.unlock();

		return tracks;
	},

/**
	* Создает из данных, полученных от сервера, массив пакетов
	* @param {O.mon.model.Device} - объект устройства
	* @param {Object[]} data - массив данных полученных от сервера
	* @return {O.mon.model.Coord[]} - массив объектов O.mon.model.Coord
	*/
	createPacketModels: function(device, data) {
		var result = [];
		Ext.each(data, function(point) {
			//Создаем объекты пакетов
			var coord = Ext.create('O.mon.model.Coord');

			coord.longitude = point.lng;
			coord.latitude = point.lat;
			//не включаем ошибочные пакеты с координатами = 0
			if (coord.latitude != 0 && coord.longitude != 0) {
				result.push(coord);
			}
		}, this);
		return result;
	},

/**
	* Центрировать карту на маркере и показать стрелку-указатель при выборе
	* пакета в панели справа
	*/
	onPacketFocus: function(packet) {
		if (packet.latitude == 0 && packet.longitude == 0) { return; }
		if (this.mapBaseLayer) {
			this.mapBaseLayer.showArrow(packet.latitude, packet.longitude);
		}
	},

/**
	* Updates panel body after tab change.
	* If map engine is loaded, let's resize it to fit panel size
	* @param {Object} params
	*//*
	updateLayout: function() {
		this.callOverridden(arguments);
		if (this.mapBaseLayer) {
			this.mapBaseLayer.doLayout();
			if (this.mapBaseLayer.engine) {
				this.mapBaseLayer.engine.checkResize();
			}
		}
	},*/

/**
	 * Fires when array of selected objects is changed
	 * @param {String} alias changetype
	 * @param {Number[]} selected list of selected object
	 * @param {Number} id of focused object
	 */
	onSelectionChange: function(alias, selected, id) {
		var layer = this.mapBaseLayer;

		if (!layer) {return;}

		var ids = Ext.Array.clone(selected);
		if (id != null) {
			if (!Ext.Array.contains(ids, id)) {
				ids.push(id);
			}
			layer.setSelectedObject(alias, id);
		}

		if (alias == 'mon_device') {
			layer.setDevices(selected, false);
			this.down('periodchooser').reload(true);
		} else if (alias == 'mon_geofence') {
			layer.setZones(ids, !!id);
		}
	},

/**
	* Activating module panel
	* @param {Object[]} params An array of module params {name: '', value: ''}
	*/
	moduleActivate: function(params) {
		this.callParent(arguments);
		if (params && Ext.isObject(params.showwork)) {
			Ext.defer(function() {
				if (this.down('baselayer').isLoaded()) {
					this.historyWindow.showWork(params.showwork);
				}
			// если карта не загружена, то задержка в секунду
			}, this.down('baselayer').isLoaded() ? 0 : 1000, this);
		}
	}

});
