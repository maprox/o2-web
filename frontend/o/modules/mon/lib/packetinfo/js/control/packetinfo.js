/**
 * @fileOverview Панель информации о устройствое
 * @class O.comp.DeviceInfo
 */
C.utils.inherit('O.comp.DeviceInfo', {
/**
	* Закладка информации о устройствое
	* @type Ext.Panel
	*/
	tabDeviceInfo: null,

/**
	* Последний загруженный пакет
	* @type O.mon.model.Packet
	*/
	packet: null,

/**
	* Закладка событий устройства
	* @type Ext.Panel
	*/
	tabDeviceEvents: null,

/**
	* How many images will be displayed in image window
	* @type Integer
	*/
	imageCount: 4,

/**
	* @constructs
	* @param {Object} config Объект конфигурации
	*/
	initComponent: function() {
		var me = this;
		this.addEvents('coordselected');
		this.callOverridden(arguments);
		this.tabDeviceInfo = this.down('panel[tabtype=information]');
		this.tabDeviceEvents = this.down('panel[tabtype=events]');
		if (this.tabDeviceEvents.down('gridpanel') != null) {
			this.tabDeviceEvents.on('selectionchange', 'eventSelected', this);
		}
		this.clear();

		C.bind(['clock5', 'mon_device'], this);

		/**
		 * ID устройства, которому принадлежит пакет
		 */
		this.deviceId = 0;

		// packet info grid
		this.dataGrid = this.down('gridpanel');

		if (this.dataGrid) {
			this.dataGrid.on('cellclick', this.onCellClick, this);
		}

		// Call button
		var btnCall = this.down('#btnCall');
		if (btnCall) {
			btnCall.on('click', this.onBtnCallClick, this);
		}
		// Call clock
		this.callClock = this.down('#callClock');

		// Clock task
		var runner = new Ext.util.TaskRunner();
		this.clockTask = runner.newTask({
			run: me.updateClock,
			interval: 1000,
			scope: me
		});
	},

/**
	 * Update clock add one second
	 */
	updateClock: function() {
		var me = this;
		this.callTime = Ext.Date.add(this.callTime, Ext.Date.SECOND, 1);
		me.callClock.update(Ext.Date.format(this.callTime, 'i:s'));
	},

/**
	 * On btn call click
	 */
	onBtnCallClick: function(btn) {
		if (btn.state) {
			// Reset call time
			this.callTime = new Date(new Date().setHours(0,0,0,0));

			this.clockTask.start();

			btn.setText(_('End call'));
			btn.setIconCls('endcall_btn');
			this.callClock.show();
		} else {

			this.clockTask.stop();

			btn.setText(_('Call'));
			btn.setIconCls('call_btn');
			this.callClock.hide();
			// Reset clock
			this.callClock.update('00:00');
		}

		btn.state = !btn.state;
	},

/**
	* On cell click handler
	*/
	onCellClick: function(t, td, ci, record, tr, ri, e) {
		var me = this;
		if (record.get('packetItemName') == _('Last image')) {
			if (e.target.nodeName == 'DIV'
				|| e.target.nodeName == 'IMG'
			) {
				// Destroy pervious image window
				if (this.imageWindow) {
					this.imageWindow.destroy();
				}
				// Get image object
				var img = Ext.decode(this.lastImage);
				// Current device id
				var idDevice = img.id_device;

				// Image store
				var imageStore = C.getStore('mon_device_image', {
					remoteFilter: true,
					remoteSort: true,
					sorters: [{
						property: 'time',
						direction: 'DESC'
					}],
					proxy: {
						type: 'ajax',
						url: '/mon_device_image',
						reader: {
							type: 'json',
							root: 'data',
							totalProperty: 'count'
						},
						extraParams: {
							'$joined': 1,
							'$showtotalcount': 1,
							'$filter': 'id_device EQ ' + idDevice
						}
					},
					pageSize: this.imageCount,
					autoLoad: false
				});

				var thumbTpl = new Ext.XTemplate(
					'<div class="thumbs">',
					'<tpl for=".">',
						'<div class="last-image">',
							'<div class="last-image-description">',
								'{[this.convertImageTime(values.time)]}',
							'</div>',
							'<img src="/mon_device_image/{id}/draw/small" />',
						'</div>',
					'</tpl>',
					'<div style="clear: both"> </div>',
					'</div>',
					{
						convertImageTime: function(time) {
							return me.convertImageTime(time);
						}
					}
				);

				var thumbsView = Ext.create('Ext.view.View', {
					store: imageStore,
					tpl: thumbTpl,
					itemSelector: 'div.last-image',
					emptyText: _('No images available')
				});
				this.imageWindow = Ext.widget('imagewindow', {
					cls: 'imageview',
					imageStore: imageStore,
					thumbsView: thumbsView,
					imageCount: this.imageCount
				});
				this.imageWindow.setImage({
					id: img.id,
					time: img.time,
					note: img.note
				});
				this.imageWindow.show();
			}
		}
	},

	/**
	 * @private
	 */
	onUpdateClock5: function() {
		this.updateData();
	},

	/**
	 * @private
	 */
	onUpdateMon_device: function(data) {
		if (data.length && data[0] && (data[0].id == this.deviceId)) {
			this.updateData();
		}
	},

/**
	* Returns formated image time
	*/
	convertImageTime: function(time) {
		if (!time) { return null; }
		return Ext.util.Format.date(
			new Date().pg_fmt(time).pg_utc(C.getSetting('p.utc_value')),
			O.format.Timestamp);
	},

/**
	* При выборе события в гриде организуем event "выбрано событие"
	*/
	eventSelected: function(selected) {
		if (selected.lastSelected === undefined) { return; }
		if (selected.lastSelected === null) { return; }

		var latitude = selected.lastSelected.get('latitude'),
			longitude = selected.lastSelected.get('longitude');

		if (latitude != 0 && longitude != 0) {
			this.fireEvent('coordselected', Ext.create('O.mon.model.Coord', {
				latitude: latitude,
				longitude: longitude
			}));
		}
	},

/**
	* Shows work on map
	* @param {Object} work
	*/
	showWork: function(work) {
		this.fireEvent('coordselected', {
			latitude: work.latitude,
			longitude: work.longitude
		});
	},

/**
	* Обновление данных устройства
	*/
	updateData: function() {
		if (this.deviceId == 0) { return; }
		var devices = C.get('mon_device');
		if (devices) {
			var device = devices.get(this.deviceId);
			if (device) {
				this.setPacket(device.getLastPacket());
			}
		}
	},

/**
	* Функция, которая очищает текущую информацию
	*/
	clear: function() {
		if (this.tablDeviceInfo) {
			this.tabDeviceInfo.disable();
		}
		this.tabDeviceEvents.disable();
		var store = this.down('gridpanel').getStore();
		store.removeAll();
		this.deviceId = 0;
	},

/**
	* Функция назначения устройства, для отображения информации о нем.
	* @param {O.mon.model.Device} m Объект устройства
	*/
	setPacket: function(p) {
		this.packet = p;
		// выходим из процедуры, если передан некорректный объект
		if (!(p instanceof O.mon.model.Packet)) {
			this.setEmpty();
			return;
		}
		var device = p.device;
		this.deviceId = device.id;
		this.tabDeviceInfo.enable();
		if (this.deviceId != this.tabDeviceEvents.getLastDeviceId()) {
			this.tabDeviceEvents.load(this.deviceId);
			// If device selection changed, load owner data for device
			this.lastOwnerData = [];
			this.loadOwnerData(device.id);
		}
		this.tabDeviceEvents.enable();

		var status, statusAlias, connection, connectionAlias;
		if (device.isLost()) {
			var time = device.getLostDataString();
			status = this.msgDeviceStatusNoData.replace(/%s/g, time);
			statusAlias = 'nodata';
		} else {
			if (device.isMoving()) {
				status = this.msgDeviceStatusMove;
				statusAlias = 'move';
			} else {
				status = this.msgDeviceStatusStay;
				statusAlias = 'stay';
			}
		}

		if (device.isUnconfigured()) {
			connection = this.msgDeviceConnectionUnconfigured;
			connectionAlias = 'unconfigured';
		} else {
			if (!device.isConnected()) {
				connection = this.msgDeviceConnectionDropped;
				connectionAlias = 'dropped';
			} else {
				connection = this.msgDeviceConnectionOpen;
				connectionAlias = 'open';
			}
		}

		// Params for property grid
		var params = [];

		// Name
		params.push({
			name: _('Name'),
			value: device.getName()
		});

		// Status
		if (!p.isStaticPoint()) {
			params.push({
				name: this.msgDeviceStatus,
				value: '<span class="status_' + statusAlias + '">' +
						status +
					'</span>'
			});

			// Connection
			params.push({
				name: this.msgDeviceConnected,
				value: '<span class="connection_' + connectionAlias + '">' +
						connection +
					'</span>'
			});
		}

		// Receive time
		var receiveTime = p.getTime("d-m-Y H:i:s")

		// If type is camera
		if (p.isStaticPoint() && device.lastimage) {
			var img = Ext.decode(device.lastimage);
			receiveTime =
				Ext.Date.format(
					C.utils.toDate(img.time).pg_utc(
						C.getSetting('p.utc_value')),
					O.format.Timestamp
				);
		}
		params.push({
			name: _('Receive time'),
			value: receiveTime
		});

		// Speed
		if (!p.isStaticPoint()) {
			params.push({
				name: _('Speed'),
				value: C.utils.fmtSpeed(p.speed)
			});

			// Odometer
			var odometer = (p.odometer_ext / 1000).toFixed(2);
			if (odometer) {
				params.push({
					name: _('Odometer'),
					value: odometer
				});
			}
		}

		// Coordinates
		var coordsValue = C.utils.fmtCoord(p);
		if (p.isStaticPoint()) {
			coordsValue = '<a href="#" class="set-coords">'
				+ coordsValue
				+ '</a>';
		}

		Ext.Array.push(params, [{
			name: _('Coords'),
			value: coordsValue
		}]);

		// Device sensors
		Ext.Array.push(params, p.getDisplaySensors());

		// GPS signal
		if (!p.isStaticPoint()) {
			params.push({
				name: _('GPS signal'),
				value: p.satellitescount,
				type: 'signal'
			})
		}

		if (device.lastimage) {
			this.lastImage = device.lastimage;
			params.push({
				name: _('Last image'),
				value: device.lastimage
			});
		}

		// Add owner data
		var ownerDataParams = this.getOwnerDataParams();
		var ownerDataCount = ownerDataParams.length;

		// TEMP START
		if (C.getSetting('p.login') != 'тестовый') {
		// TEMP END
			Ext.Array.push(params, ownerDataParams);
		// TEMP START
		}
		// TEMP END

		if (C.utils.equals(params, this.prevParams)) {
			return;
		}
		var store = this.down('gridpanel').getStore();
		this.updateStore(params, store);
		this.prevParams = params;

		//Заносим адрес в стор, при необходимости запрашиваем
		//результаты геокодинга у сервера
		var place = this.msgDevicePlace;

		// Owner data always at bottom of the grid
		var addressIndex = store.count();
		if (this.lastOwnerData) {
			addressIndex = store.count() - ownerDataCount
		}

		if (p.address == null) {
			store.insert(addressIndex, {
				packetItemName: place,
				packetItemValue: '<div class="loader">&nbsp;</div>'
			});
			var lastLoading = p.time;
			p.getAddress(function(address, packet) {
				if (packet.time.getTime() >= lastLoading.getTime()) {
					var rec = store.getAt(addressIndex);
					if (rec) {
						rec.set('packetItemValue', address);
						rec.commit();
					}
				}
			}, this);
		} else {
			store.insert(addressIndex, {
				packetItemName: place,
				packetItemValue: p.address
			});
		}

		//обновляем
		this.doLayout();

		// Bind set coords link
		if (p.isStaticPoint()) {
			this.bindSetCoordsLink();
		}
	},

/**
	 * Returns owner data params
	 * @return Array
	 */
	getOwnerDataParams: function() {
		var params = [];
		if (this.lastOwnerData) {

			if (this.lastOwnerData['firm_name']) {
				params.push({
					name: _('Owner'),
					value: this.lastOwnerData['firm_name']
				});
			}

			if (this.lastOwnerData['sdt']) {
				var timeVal = this.convertTime(this.lastOwnerData['sdt']);

				if (this.lastOwnerData['edt']) {
					timeVal = timeVal += ' '
						+ _('till')
						+ ' '
						+ this.convertTime(this.lastOwnerData['edt']);
				}

				params.push({
					name: _('Access from'),
					value: timeVal
				})
			}

			if (this.lastOwnerData['firstname']) {
				var grantedBy = this.lastOwnerData['firstname'];
				if (this.lastOwnerData['lastname']) {
					grantedBy = grantedBy + ' '
						+ this.lastOwnerData['lastname'];
				}
				params.push({
					name: _('Granted by'),
					value: grantedBy
				});
			}

			if (this.lastOwnerData['dt']) {
				params.push({
					name: _('Granted at'),
					value: this.convertTime(this.lastOwnerData['dt'])
				});
			}
		}

		return params;
	},

/**
	* Loads owner data
	* @param record
	*/
	loadOwnerData: function(deviceId) {
		var deviceStore = C.getStore('mon_device');
		var device = deviceStore.getById(deviceId);

		// Load data only for foreign devices
		if (!device || !device.get('foreign')) {
			this.lastOwnerData = [];
			return;
		}

		Ext.Ajax.request({
			url: '/mon_device/ownerinfo',
			method: 'GET',
			params: {
				id_device: deviceId
			},
			callback: function(opts, success, response) {
				if (!success) { return; }

				var answer = C.utils.getJSON(response.responseText, opts);
				if (answer.data) {
					var data = answer.data;
					if (data.length) {
						this.lastOwnerData = data[0];
						this.updateData();
					} else {
						this.lastOwnerData = [];
					}
				} else {
					this.lastOwnerData = [];
				}
			},
			scope: this
		});
	},

/**
	* Returns formated time string
	*/
	convertTime: function(time) {
		if (typeof(time) == 'object') {
			return Ext.util.Format.date(
				time.pg_utc(C.getSetting('p.utc_value')),
				O.format.Timestamp);
		} else {
			return Ext.util.Format.date(
				new Date().pg_fmt(time).pg_utc(C.getSetting('p.utc_value')),
				O.format.Timestamp);
		}
	},

/**
	* Display message that we have no information about device
	*/
	setEmpty: function() {
		this.tabDeviceInfo.enable();
		if (this.deviceId != this.tabDeviceEvents.getLastDeviceId()) {
			this.tabDeviceEvents.load(this.deviceId);
			// If device selection changed, load owner data for device
			this.lastOwnerData = [];
			this.loadOwnerData(this.deviceId);
		}
		this.tabDeviceEvents.enable();

		this.prevParams = {};
		var devices = C.get('mon_device'),
			device = null;
		if (devices) {
			device = devices.get(this.deviceId);
		}
		if (device) {
			var connectionAlias = 'unconfigured';
			var connection = this.msgDeviceConnectionUnconfigured;
			if (device && device.lastconnect) {
				connectionAlias = 'dropped';
				connection = this.msgDeviceConnectionDropped;
			}

			var params = [{
				name: _('Name'),
				value: device.name
			}];

			if (!device.lastimage) {
				params.push({
					name: this.msgDeviceStatus,
					value: '<span class="status_nodata">' +
							this.msgDeviceStatusNoData.replace(/%s/g, '') +
						'</span>'
				});
				params.push({
					name: this.msgDeviceConnected,
					value: '<span class="connection_' +
							connectionAlias + '">' + connection +
						'</span>'
				});
			} else {
				// If there is an image from camera

				// Receive time
				var img = Ext.decode(device.lastimage);
				var receiveTime = Ext.Date.format(
					C.utils.toDate(img.time).pg_utc(
						C.getSetting('p.utc_value')),
					O.format.Timestamp
				);

				params.push({
					name: _('Receive time'),
					value: receiveTime
				});

				// Set coordinates
				Ext.Array.push(params, [{
					name: _('Coords'),
					value: '<a href="#" class="set-coords">'
						+ _('Set coordinates')
						+ '</a>'
				}]);

				this.lastImage = device.lastimage;
				params.push({
					name: _('Last image'),
					value: device.lastimage
				});
			}

			// Add owner data
			var ownerDataParams = this.getOwnerDataParams();
			Ext.Array.push(params, ownerDataParams);

			var store = this.down('gridpanel').getStore();
			this.updateStore(params, store);
		}

		//обновляем
		this.doLayout();

		// Bind set coords link
		this.bindSetCoordsLink();
	},

	/**
	 * Display message that we have no information about device
	 */
	setNoDevice: function() {
		if (this.deviceId != this.tabDeviceEvents.getLastDeviceId()) {
			this.tabDeviceEvents.load(this.deviceId);
		}
		this.tabDeviceEvents.disable();

		this.prevParams = {};
		var params = [{
			name: _('Status'),
			value: _('No device is linked')
		}];

		var store = this.down('gridpanel').getStore();
		this.updateStore(params, store);

		//обновляем
		this.doLayout();
	},

/**
	* Set handlers on set coords link
	*/
	bindSetCoordsLink: function() {
		var setCoordsLinkDom = Ext.dom.Query.select('.set-coords');
		if (setCoordsLinkDom.length) {
			var setCoordsLink = Ext.get(setCoordsLinkDom[0]);
			setCoordsLink.on('click', this.showCoordsWindow, this);
		}
	},

/**
	* Show coordinates window
	*/
	showCoordsWindow: function(e, el) {

		var windowParams = {
			deviceId: this.deviceId
		}

		if (this.packet && this.packet.latitude) {
			windowParams.latitude = this.packet.latitude;
			windowParams.longitude = this.packet.longitude;
		}

		var coordsWindow = Ext.widget('coordswindow', windowParams);

		coordsWindow.show();

		e.preventDefault();
	},

/**
	* Геттер для последнего полученного пакета
	* @return {O.mon.model.Packet}
	*/
	getPacket: function() {
		return this.packet;
	},

/**
	* Обновляет Store, записывает туда свойства
	* @param {Object[]} params данные для записи
	* @param {Ext.data.Store} store
	*/
	updateStore: function(params, store) {
		// Заносим все значения в стор
		store.removeAll();

		// Странный баг, с неудалением этих моделей из менеджера. Удалим вручную.
		Ext.ModelManager.each(function(key, model) {
			if (model.$className == 'O.mon.model.PacketProp') {
				Ext.ModelManager.unregister(model);
			}
		});

		var data = [];
		for (var i = 0; i < params.length; i++) {
			data.push({
				packetItemName: params[i].name,
				packetItemValue: params[i].value
			});
		}
		store.add(data);
	}
});
