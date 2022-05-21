/**
 * Map module controller
 * @class O.app.controller.Map
 * @extends Ext.app.Controller
 */
Ext.define('O.app.controller.Map', {
	extend: 'Ext.app.Controller',
	views: ['Map'],

	config: {
		refs: {
			container: '#map',
			navigation: '#map #navigation',
			btnObjects: '#map #navigation segmentedbutton[action=objects]',
			btnInfo: '#map #navigation segmentedbutton[action=info]',
			btnConfig: '#map #navigation button[action=config]',
			baseLayer: '#map #baselayer',
			objectsGroupsList: {
				selector: '#map_objectsgroupslist',
				id: 'map_objectsgroupslist',
				xtype: 'objectsgroupslist',
				autoCreate: true
			},
			mapConfig: {
				selector: 'mapconfig',
				xtype: 'mapconfig',
				autoCreate: true
			},
			deviceInfoOverlay: {
				selector: 'deviceinfooverlay',
				xtype: 'deviceinfooverlay',
				autoCreate: true
			}
		},
		control: {
			btnObjects: {
				toggle: 'onBtnObjectsToggle'
			},
			btnInfo: {
				toggle: 'onBtnInfoTap'
			},
			deviceInfoOverlay: {
				close: 'onInfoOverlayClose'
			},
			btnConfig: {
				tap: 'onBtnConfigTap'
			},
			mapConfig: {
				change: 'onOptionChange'
			},
			objectsGroupsList: {
				selectionchange: 'onSelectionChange',
				checkchange: 'onCheckChange',
				afterload: 'onListAfterLoad',
				close: 'onListClose'
			},
			baseLayer: {
				engineload: 'onEngineLoad',
				selectpacket: 'onSelectPacket',
				selectdevice: 'onSelectDevice',
				checkdevice: 'onCheckDevices'
			}
		}
	},

/**
	* Controller initialization
	* @construct
	*/
	init: function() {
		Ext.Viewport.on({
			orientationchange: 'onOrientationChange',
			resize: 'onResize',
			scope: this
		});
		// listen for model update and new packets
		O.manager.Model.bind(['mon_geofence', 'mon_device'],
			this.onModelChange, this);
	},

/**
	* A template method like {@link #init}, but called after the
	* viewport is created.
	* This is called after the {@link Ext.app.Application#launch launch}
	* method of Application is executed.
	*
	* @param {Ext.app.Application} application
	* @protected
	*/
	launch: function(application) {
		M.act.map.State.init(this);
	},

/**
	* Objects button toggles its state
	* @param {Ext.SegmentedButton} sb
	* @param {Ext.Component} button
	* @param {Boolean} pressed
	* @private
	*/
	onBtnObjectsToggle: function(sb, button, pressed) {
		var container = this.getContainer();
		var objectsGroupsList = this.getObjectsGroupsList();
		if (pressed) {
			objectsGroupsList.showInContainer(container, button);
		} else {
			objectsGroupsList.hide();
		}
	},

/**
	* Fires when objectsgroupslist is hidden via close button
	* @private
	*/
	onListClose: function() {
		this.getBtnObjects().setPressedButtons([]);
	},


/**
	* Fires when objectsgroupslist is hidden via close button
	* @private
	*/
	onInfoOverlayClose: function() {
		this.getBtnInfo().setPressedButtons([]);
	},

/**
	* Handler of orientation change
	* @private
	*/
	onOrientationChange: function() {
		var orientation = Ext.Viewport.getOrientation();
		//alert('orientation is ' + orientation);
	},

/**
	* Handler for the resize event
	* @private
	*//*
	onResize: function() {
		//alert('windows is resized!');
	},*/

/**
	* Info button pressed
	* @param {Ext.Component} container
	* @param {Ext.Component} button
	* @param {Boolean} pressed
	* @private
	*/
	onBtnInfoTap: function(container, button, pressed) {
		var container = this.getContainer();
		var deviceInfoOverlay = this.getDeviceInfoOverlay();
		if (pressed) {
			deviceInfoOverlay.showInContainer(container, button);
		} else {
			deviceInfoOverlay.hide();
		}
	},

/**
	* Config button pressed
	* @private
	*/
	onBtnConfigTap: function() {
		var container = this.getContainer();
		this.getMapConfig().showInContainer(container, this.getBtnConfig());
	},

/**
	* Handles option changing
	* @param {Object} options
	* @private
	*/
	onOptionChange: function(options) {
		for (var option in options) {
			if (!options.hasOwnProperty(option)) { continue; }
			this.applyOption(option, options[option]);
		}
	},

/**
	* Applies an option
	* @param {String} name Option name
	* @param {Object} value Option value
	* @private
	*/
	applyOption: function(name, value) {
		switch (name) {
			case 'followselected':
				this.trackingState = value ? true : false;
				this.getBaseLayer().toggleSelectedTracking(
					this.trackingState, !this.trackingState);
				break;
			case 'showpath':
				this.getBaseLayer().showLastPoints(value);
				break;
			case 'showlabels':
				this.getBaseLayer().toggleDeviceLabels(!!value);
				break;
		}
	},

/**
	* Fires when engine is loaded
	*/
	onEngineLoad: function() {
		this.getObjectsGroupsList().restoreSelection();
		this.devicesUpdateTask();
		if (this.deviceWindow) {
			var panelDevices = this.groupsList.getDevicesPanel();
			var deviceId = panelDevices.getSelectedObjectId();
			this.selectDeviceById(deviceId);
		}
	},

/**
	* Update devices state function
	* @param {O.mon.model.Device[]} devices Массив Объектов устройств
	*/
	devicesUpdateTask: function(devices) {
		var layer = this.getBaseLayer();
		if (layer) {
			devices = devices || layer.getDevices().getRange();

			layer.devicesUpdate(devices);
		}
	},

/**
	* Showing packet within the baselayer
	* @param {Object} packet
	*/
	onEventSelected: function(packet) {
		var layer = this.getBaseLayer();
		if (!layer || !packet ||
		       (packet.latitude == 0 &&
		        packet.longitude == 0)) {
			return;
		}
		layer.showArrow(packet.latitude, packet.longitude);
	},

/**
	* Model changing event
	* @param {Object[]} data
	* @param {String} type
	*/
	onModelChange: function(data, type) {
		var layer = this.getBaseLayer();
		if (layer) {
			if (type == "mon_geofence") {
				layer.updateZones();
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
		var layer = this.getBaseLayer();
		if (layer/* && this.deviceWindow*/) {
			layer.devicesUpdate(devices);
			//this.deviceWindow.updateData(devices);
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
			var objectsGroupsList = this.getObjectsGroupsList();
			objectsGroupsList.selectDevice(packet.id_device);
			//this.groupsList.getDevicesPanel().selectObjectId(packet.deviceid);
			//this.deviceWindow.loadPacket(packet);
		}
	},

	/**
	 * Device selection handler
	 * @param {Integer} deviceId
	 */
	onSelectDevice: function(deviceId) {
		this.getObjectsGroupsList().selectDevice(deviceId);
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
		this.getObjectsGroupsList().checkDevices(deviceIds);
	},

/**
	* Fires when data is loaded into grouped list
	* @param {O.lib.abstract.GroupsList} list
	* @param {Object} data Loaded data
	*/
	onListAfterLoad: function(list, data) {
		list.doDefaultSelection();
	},

/**
	* Object check change event handler
	* @param {O.lib.abstract.GroupsList} list
	*/
	onCheckChange: function(list) {
		this.onStateChange(list, false);
	},

/**
	* Object selection event handler
	* @param {Object} list List of objects
	*/
	onSelectionChange: function(list) {
		this.onStateChange(list, true);
	},

/**
	* Object state change event handler
	* @param {Object} list List of objects
	* @param {Boolean} selectionChange have selection changed or not
	*/
	onStateChange: function(list, selectionChange) {
		var layer = this.getBaseLayer();

		if (!layer) { return; }
		if (!layer.isLoaded()) { return; }

		var id = list.getSelectedObjectId();
		if (selectionChange) {
			if (!id || typeof(id) !== 'number') { return; }
		}

		layer.resetControls();

		var alias = list.config.itemAlias;
		var ids = Ext.Array.clone(list.getCheckedObjects());

		// adding selected object to an ids array
		if (id && Ext.Array.indexOf(ids, id) < 0) {
			ids.push(id);
		}

		if (selectionChange) {
			layer.setSelectedObject(alias, id);
		}

		switch (alias) {
			case 'mon_device':
				layer.setDevices(ids, true, true);
				this.selectDeviceById(id);
				break;
			case 'mon_geofence':
				layer.setZones(ids, true);
				break;
		}
	},

/**
	* Selects device by its identifier
	* @param Number deviceId device identifier
	*/
	selectDeviceById: function(deviceId) {
		var deviceInfoOverlay = this.getDeviceInfoOverlay();
		deviceInfoOverlay.setDevice(deviceId);
	},

/**
	* Activating module panel
	* @param {Object[]} params An array of module params {name: '', value: ''}
	*/
	moduleActivate: function(params) {
		if (params && Ext.isObject(params.showwork)) {
			var packet = params.showwork;
			var me = this;
			var baselayer = this.getBaseLayer();
			C.utils.wait(function() {
				return baselayer.isLoaded();
			}, {
				callback: function(success) {
					if (!success) { return; }
					//me.deviceWindow.showWork(params.showwork);
					me.onEventSelected(packet);
				}
			});
		}
	}
});
