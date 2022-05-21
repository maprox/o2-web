/**
 *
 * Device history window
 * @class O.comp.DeviceInfoPanel
 * @extends Ext.panel.Panel
 */
C.utils.inherit('O.comp.DeviceInfoPanel', {
	initComponent: function() {
		this.callOverridden(arguments);
		this.mapPacketInfo = this.down('mapdeviceinfo');
		this.relayEvents(this.mapPacketInfo, ['coordselected']);
		this.on({
			expand: function() {
				this.doLayout();
			}
		});
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
	* Shows work on map
	* @param {Object} work
	*/
	showWork: function(work) {
		this.mapPacketInfo.fireEvent('coordselected', {
			latitude: work.latitude,
			longitude: work.longitude
		});
	},


/**
	* COMMENT THIS
	*/
	updateData: function(devices) {
		this.mapPacketInfo.updateData(devices);
	},

/**
	* COMMENT THIS
	*/
	loadPacket: function(p) {
		if (this.mapPacketInfo) {
			this.mapPacketInfo.setPacket(p);
		}
	},

/**
	* Sets info window to track deviceId
	* @param {Number} deviceId
	*/
	setEmpty: function(deviceId) {
		if (this.mapPacketInfo) {
			this.mapPacketInfo.deviceId = deviceId;
			this.mapPacketInfo.setPacket(null);
		}
	},

	/**
	 * Display message that no devices are binded to this vehicle
	 */
	setNoDevice: function() {
		if (this.mapPacketInfo) {
			this.mapPacketInfo.deviceId = 0;
			this.mapPacketInfo.setNoDevice();
		}
	},

/**
	* COMMENT THIS
	*/
	clear: function() {
		this.mapPacketInfo.clear();
	},

/**
	* Gets data from another O.comp.HistoryPanel
	* @param {O.comp.HistoryPanel}
	*/
	getData: function(object) {
		var packet = object.mapPacketInfo.getPacket();
		this.loadPacket(packet);
	},

/**
	* Indicates, when data was loaded to child panels
	*/
	isDataLoaded: function() {
		return this.dataLoaded;
	}
});
