/**
 * Packet manager
 * @class O.manager.Packet
 * @singleton
 */
Ext.define('O.manager.Packet', {
	extend: 'Ext.util.Observable',
	singleton: true,

/**
	* @constructs
	*/
	init: function() {
		C.bind('mon_packet', this);
	},

/**
	* Device packets change
	* @param {Object} data Packets data
	*/
	onUpdateMon_packet: function(data) {
		// retrieve device list
		C.get('mon_device', function(devices) {
			var packetsList = {};
			for (var i = 0; i < data.length; i++) {
				var packet = data[i];
				if (!packetsList[packet.id_device]) {
					packetsList[packet.id_device] = [];
				}
				packetsList[packet.id_device].push(packet);
			}
			for (var deviceId in packetsList) {
				if (packetsList.hasOwnProperty(deviceId)) {
					var device = devices.get(deviceId);
					if (device && device.packetsAdd) {
						device.packetsAdd(packetsList[deviceId]);
					}
				}
			}
		}, this);
	}
}, function() {
	// initialization
	this.init();
});
