/**
 * @fileOverview Класс окна мониторинга объектов
 * В центре окна располагается карта перемещения (Google, Yandex, etc.).
 * Слева (или справа) список групп устройств, которые можно включать/выключать
 *
 * @class O.map.Panel
 * @extends C.ui.Panel
 */
C.utils.inherit('O.map.Panel', {

/**
	* Indicates, if tracking selected devices is on or off
	* @var {Boolean}
	*/
	trackingState: false,

/**
	* Component initialization
	*/
	initComponent: function() {
		this.callOverridden(arguments);
		if (this.geozonePanel) {
			this.geozonePanel.setVisible(false);
		}
		if (this.groupsList) {
			this.groupsList.on({
				selectionchange: 'onSelectionChange',
				checkchange: 'onCheckChange',
				scope: this
			});
		}
		if (this.mapBaseLayer) {
			this.mapBaseLayer.on({
				engineLoad: 'onEngineLoad',
				selectdevice: 'onSelectDevice',
				checkdevice: 'onCheckDevices',
				scope: this
			});
		}
		if (this.mapRegion) {
			//this.mapRegion.on('resize', 'onResize', this);
		}
		this.on({
			afterrender: 'onAfterRender',
			scope: this
		});
		O.manager.Model.bind(['mon_geofence', 'mon_device'],
			this.onModelChange, this);
	},

/**
	* Handler for afterrender event
	* @private
	*/
	onAfterRender: function() {
		this.checkGeozone();

		this.btnCreateZone.setHandler(this.showGeozonePanel, this);
		this.btnToggleFollow.setHandler(this.followSelected, this);
		this.btnToggleShowTrack.setHandler(this.showLastPoints, this);
		this.btnToggleShowLabels.setHandler(this.showDeviceLabels, this);
		//this.btnToggleMiniMap.setHandler(this.toggleMiniMap, this);

		this.trackingState = this.btnToggleFollow.pressed;
		if (this.mapBaseLayer) {
			var layer = this.mapBaseLayer;
			layer.toggleSelectedTracking(this.trackingState);
			layer.showLastPoints(this.btnToggleShowTrack.pressed);
			layer.toggleDeviceLabels(this.btnToggleShowLabels.pressed);
		}

		if (this.geozonePanel) {
			this.geozonePanel.on({
				beforeGeozoneCreate: 'onBeforeGeozoneCreate',
				colorChanged: 'onGeozoneColorChanged',
				creationCanceled: 'onGeozoneCreationCancelled',
				primitiveChanged: 'onPrimitiveChanged',
				geozoneCreated: 'onGeozoneCreated',
				scope: this
			});
		}
		// Отлавливаем событие переключения вкладок родительской панели
		this.up('tabpanel').on({
			tabchange: 'onParentPanelChanged',
			beforetabchange: 'hideControls',
			scope: this
		});
		// device information window
		this.deviceWindow = Ext.create('O.comp.DeviceInfoWindow', {
			stateId: 'w_deviceinfo'
		});

		this.devicePanel = this.down('mappanel');

		if (Ext.state.Manager.get('mapPanelCollapsed')) {
			this.setInactiveDeviceInfo(this.deviceWindow);
			this.setActiveDeviceInfo(this.devicePanel);
		} else {
			this.setInactiveDeviceInfo(this.devicePanel);
			this.setActiveDeviceInfo(this.deviceWindow);
		}
	},

/**
	* Shows and adds listeners to device info object
	* @param {O.comp.DevicePanel} object
	*/
	setActiveDeviceInfo: function(object) {
		object.on({
			coordselected: 'onEventSelected',
			collapse_panel: this.onWindowCollapse,
			unfold: this.onWindowUnfold,
			scope: this
		});
		object.show();
		this.activeDeviceInfo = object;
	},

/**
	* Hides and clear listeners for device info object
	* @param {O.comp.DevicePanel} object
	*/
	setInactiveDeviceInfo: function(object) {
		object.un({
			coordselected: this.onEventSelected,
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
		Ext.state.Manager.set('mapPanelCollapsed', true);
		this.devicePanel.getData(this.deviceWindow);
		this.setInactiveDeviceInfo(this.deviceWindow);
		this.setActiveDeviceInfo(this.devicePanel);
	},

/**
	* When window signals 'unfold' render it back to map
	*/
	onWindowUnfold: function() {
		Ext.state.Manager.set('mapPanelCollapsed', false);
		this.deviceWindow.getData(this.devicePanel);
		this.setInactiveDeviceInfo(this.devicePanel);
		this.setActiveDeviceInfo(this.deviceWindow);
	},

/**
	* Updates state of a "Create zone" button
	* @protected
	*/
	checkGeozone: function() {
		this.btnCreateZone.setDisabled(
			!C.manager.Auth.canCreate('mon_geofence'));
	},

/**
	* Update devices state function
	* @param {O.mon.model.Device[]} devices Массив Объектов устройств
	*/
	devicesUpdateTask: function(devices) {
		devices = devices || this.mapBaseLayer.getDevices().getRange();
		if (this.mapBaseLayer) {
			this.mapBaseLayer.devicesUpdate(devices);
		}
	},

/**
	* Обработка выбора события в панели информации об устройстве
	*/
	onEventSelected: function(packet) {
		if (!this.mapBaseLayer || !packet ||
		       (packet.latitude == 0 &&
		        packet.longitude == 0)) {
			return;
		}
		this.mapBaseLayer.showArrow(packet.latitude, packet.longitude);
	},

/**
	* Model changing event
	* @param {Object[]} data
	* @param {String} type
	*/
	onModelChange: function(data, type) {
		if (this.mapBaseLayer) {
			if (type == "mon_geofence") {
				this.mapBaseLayer.updateZones();
			} else if (type == 'mon_device') {
				this.devicesUpdateTask(data);
			}
		}
	},

/**
	* Обработчик события "Обновились данные устройства"
	* @param {O.mon.model.Device[]} devices Массив ID Объектов устройств
	*/
	devicesUpdate: function(devices) {
		if (this.mapBaseLayer && this.deviceWindow) {
			this.mapBaseLayer.devicesUpdate(devices);
			this.activeDeviceInfo.updateData(devices);
		}
	},

/**
	* Включаем/отключаем отображение подписей к устройствам
	*/
	showDeviceLabels: function() {
		this.mapBaseLayer.toggleDeviceLabels(this.btnToggleShowLabels.pressed);
	},

/**
	* Включаем/отключаем отображение последних точек трека
	*/
	showLastPoints: function() {
		this.mapBaseLayer.showLastPoints(this.btnToggleShowTrack.pressed);
	},

/**
	* Включаем/отключаем режим слежения
	*/
	followSelected: function() {
		this.trackingState = this.btnToggleFollow.pressed;
		this.mapBaseLayer.toggleSelectedTracking(
			this.trackingState,
			!this.trackingState
		);
	},

/**
	* Прячем панель создания геозоны
	*/
	hideControls: function(panel, newCard) {
		if (newCard != this) {return;}
		if (this.mapBaseLayer) {
			this.mapBaseLayer.stopDrawing();
		}
		if (this.geozonePanel) {
			this.geozonePanel.cancelGeozoneCreation();
		}
	},

/**
	* При смены вкладки родительской панели нужно обновить состояние кнопки
	* "создать геозону" - может быть уже нельзя этого делать
	*/
	onParentPanelChanged: function(panel, newCard) {
		if (newCard != this) {
			this.activeDeviceInfo.hide();
		} else {
			this.activeDeviceInfo.show();
		}
		this.checkGeozone();
		if (this.mapBaseLayer) {
			this.mapBaseLayer.updateMap();
		}
	},

/**
	* Начало создания геозоны - нужно сохранить набор точек
	*/
	onBeforeGeozoneCreate: function() {
		this.geozonePanel.setPoints(this.mapBaseLayer.engine.getPointsArray());
	},

/**
	* Обработчик события "геозона создана"
	* @param {Integer} zoneId Id новой зоны
	*/
	onGeozoneCreated: function(zoneId) {
		this.mapBaseLayer.stopDrawing();
		this.btnCreateZone.toggle(false, true);
		//проверяем количество геозон
		C.get('mon_geofence', function(models) {
			this.groupsList.getZonesPanel().reload();
			this.btnCreateZone.setDisabled(
				!C.manager.Auth.canCreate('mon_geofence'));
		}, this);

		var ids = this.groupsList.getZonesPanel().getSelectedObjects();
		ids.push(zoneId);
		this.groupsList.getZonesPanel().checkItems(ids);
		this.mapBaseLayer.toggleSelectedTracking(this.trackingState, true);
		// Update map
		this.onStateChange('mon_geofence', ids, zoneId, false);
		// Enable follow button
		this.btnToggleFollow.enable();
	},

/**
	* Обработчик события "отмена создания геозоны"
	*/
	onGeozoneCreationCancelled: function() {
		this.mapBaseLayer.stopDrawing();
		this.btnCreateZone.toggle(false, true);
		this.mapBaseLayer.toggleSelectedTracking(this.trackingState, true);

		// Enable follow button
		this.btnToggleFollow.enable();
	},

/**
	* Смена цвета рисуемой геозоны
	*/
	onGeozoneColorChanged: function(color) {
		this.mapBaseLayer.changeDrawingColor(color);
	},

/**
	* Обработчик события "Изменен примитив для рисования геозоны"
	*/
	onPrimitiveChanged: function() {
		this.mapBaseLayer.changeDrawingPrimitive(
			this.geozonePanel.getCurrentPrimitive()
		);
	},

/**
	* Показать панель создания геозоны
	*/
	showGeozonePanel: function() {
		if (this.btnCreateZone.pressed) {
			// Disable follow button
			this.btnToggleFollow.disable();
			this.trackingState = this.btnToggleFollow.pressed;
			this.mapBaseLayer.toggleSelectedTracking(false, true);
			C.get('mon_geofence', function(models) {
				this.geozonePanel.initValues();
				this.geozonePanel.show();
				this.mapBaseLayer.startDrawing(
					this.geozonePanel.getCurrentPrimitive()
				);
			}, this);
		} else {
			// Enable follow button
			this.btnToggleFollow.enable();
			this.geozonePanel.cancelGeozoneCreation();
			this.mapBaseLayer.toggleSelectedTracking(this.trackingState, true);
		}
	},

/**
	* Updates panel body after tab change.
	* If map engine is loaded, let's resize it to fit panel size
	* @param {Object} params
	*/
	updateLayout: function() {
		this.callOverridden(arguments);
		if (this.mapBaseLayer) {
			//this.mapBaseLayer.doLayout();
			//this.mapBaseLayer.onResize();
		}
	},

/**
	* Packet selection handler
	* @param {O.mon.model.Packet} packet
	* @param {Boolean} doPopup
	* @param {Boolean} isDevice
	*/
	onSelectPacket: function(packet, doPopup, isDevice) {
		if (!packet) { return; }
		if (isDevice) {
			this.onSelectDevice(packet.deviceId);
			//this.activeDeviceInfo.loadPacket(packet);
		}
	},

	/**
	 * Device selection handler
	 * @param {Integer} deviceId
	 */
	onSelectDevice: function(deviceId) {
		this.groupsList.getDevicesPanel().selectObjectId(deviceId);
		this.selectDeviceById(deviceId);
	},

	/**
	 * Device check handler
	 * @param {Integer} deviceIds
	 */
	onCheckDevices: function(deviceIds) {
		if (typeof(deviceIds) == 'number') {
			deviceIds = [deviceIds];
		}
		this.groupsList.getDevicesPanel().checkItems(deviceIds, false);
	},

/**
	* Object check change event handler
    * @param {String} alias changetype
    * @param {Number[]} selected list of selected object
    * @param {Number} id of focused object
	*/
	onCheckChange: function(alias, selected, id) {
		this.onStateChange(alias, selected, id, false);
	},

/**
	* Object selection event handler
	 * @param {String} alias changetype
	 * @param {Number[]} selected list of selected object
	 * @param {Number} id of focused object
	*/
	onSelectionChange: function(alias, selected, id) {
		this.onStateChange(alias, selected, id, true);
	},

/**
	* Object state change event handler
	* @param {String} alias changetype
	* @param {Number[]} selected list of selected object
	* @param {Number} id of focused object
	* @param {Boolean} selectionChange have selection changed or not
	*/
	onStateChange: function(alias, selected, id, selectionChange) {
		var layer = this.mapBaseLayer;

		if (!layer) { return; }
		if (!layer.engine) { return; }

		// @TODO: убрать кривую допроверку !(id === false && alias == 'mon_device') когда mon_vehicle станет самостоятельной сущностью
		if (selectionChange && !(id === false && alias == 'mon_device')) {
			if (!id || typeof(id) !== 'number') { return; }
		}

		var ids = Ext.Array.clone(selected);

		if (!Ext.Array.contains(ids, id)) {
			ids.push(id);
		}
		if (selectionChange) {
			layer.setSelectedObject(alias, id);
		}

		if (alias === 'mon_device' && layer.setDevices) {
			layer.setDevices(ids, true, selectionChange);
			this.selectDeviceById(id);
		} else if (alias === 'mon_geofence' && layer.setZones) {
			layer.setZones(ids, selectionChange, !selectionChange);
		}
	},

/**
	* Selects device by its identifier
	* @param Number deviceId device identifier
	*/
	selectDeviceById: function(deviceId) {
		// @TODO: убрать костыль когда mon_vehicle станет самостоятельной сущностью
		if (deviceId === false) {
			this.activeDeviceInfo.setNoDevice();
		}

		C.get('mon_device', function(devices, success) {
			if (!success) { return; }
			var device = devices.get(deviceId);
			if (device && device.getLastPacket) {
				var packet = device.getLastPacket();
				if (packet) {
					this.activeDeviceInfo.loadPacket(packet);
				} else {
					this.activeDeviceInfo.setEmpty(deviceId);
				}
			}
		}, this);
	},

/**
	* Fires when engine is loaded
	*/
	onEngineLoad: function() {
		this.groupsList.restoreSelection();
		this.showDeviceLabels();
		this.devicesUpdateTask();
		if (this.activeDeviceInfo) {
			var panelDevices = this.groupsList.getDevicesPanel();
			var deviceId = panelDevices.getSelectedObjectId();
			this.selectDeviceById(deviceId);
		}
	},

/**
	* Activating module panel
	* @param {Object[]} params An array of module params {name: '', value: ''}
	*/
	moduleActivate: function(params) {
		this.callParent(arguments);
		var me = this;
		if (params && Ext.isObject(params.showwork)) {
			C.utils.wait(function() {
				return me.down('baselayer').isLoaded();
			}, {
				callback: function(success) {
					if (!success) { return; }
					var work = params.showwork;

					if (work.packet) {
						var packet = new O.mon.model.Packet(work.packet);
						me.deviceWindow.showWork(packet);
						if (packet.isSos()) {
							me.mapBaseLayer.drawSosBalloon(packet);
						}
					}
				}
			});
		}
	}

});
