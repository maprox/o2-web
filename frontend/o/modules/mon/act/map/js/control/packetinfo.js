/**
 * @class O.comp.MapDetailInfo
 */
C.utils.inherit('O.comp.MapDetailInfo', {

/**
	* Загрузка в панель объекта
	* @param {O.mon.model.Packet} p
	*/
	setPacket: function(p) {
		this.callParent(arguments);

		C.get('mon_device', function(devices){
			var device = devices.getByKey(this.deviceId);
			var waylist = this.child('waylistinfo');
			var commands = this.child('mapcommands');
			if (device && device.active_waylist) {
				waylist.setDevice(device);
				waylist.loadDataById(device.active_waylist);
				waylist.tab.show();
			} else {
				waylist.tab.hide();
				if (this.getActiveTab() == waylist) {
					// TODO: For some reason header active tab is not updated
					this.setActiveTab(this.child('#deviceinfo'));
				}
			}

			if (commands) {
				if (device) {
					commands.tab.show();
					if (commands.setDevice) {
						commands.setDevice(device);
					}
				} else {
					commands.tab.hide();
				}
			}

			this.updateLayout();
		}, this);
	}
});