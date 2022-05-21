/**
 * Device information panel
 *
 * @class O.comp.DeviceInfo
 * @extends Ext.tab.TabPanel
 */
C.define('O.comp.DeviceHistory', {
	extend: 'O.comp.DeviceInfo',
	alias: 'widget.devicehistory',

	// WARN: Do not remove the variable - it is used in other modules
	msgDeviceHistory: 'Detailed report',

/*
	* Returns items array
	*/
	getItems: function() {
		var items = this.callParent(arguments);
		items.unshift({
			title: this.msgDeviceHistory,
			xtype: 'detailedreport'
		}, {
			title: _('Sensors'),
			xtype: 'historysensors'
		});
		return items;
	}
});
