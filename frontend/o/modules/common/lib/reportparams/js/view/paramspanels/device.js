/**
 * @class O.reports.DevicePanel
 * @extends O.ui.groups.Devices
 */
C.define('O.reports.DevicePanel', {
	extend: 'O.ui.groups.Devices',

	initComponent: function() {
		Ext.apply(this, {
			deviceGroupsEnabled: false,
			multiSelectObjects: true,
			multiSelectGroups: true,
			padding: '5 5 5 5',
			height: 270,
			border: true
		});
		this.callParent(arguments);
	}
});
