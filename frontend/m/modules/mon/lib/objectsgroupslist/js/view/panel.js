/**
 * Groups list of devices and geofences
 * @class M.lib.objectsgroupslist.Panel
 * @extend C.ui.Panel
 */
Ext.define('M.lib.objectsgroupslist.Panel', {
	extend: 'M.kernel.ui.CardPanel',
	alias: 'widget.objectsgroupslist',

/*  Configuration */
	config: {
		width: 280,
		height: '80%',
		cls: 'x-static',

		/**
		 * Allow multiple selection of devices
		 * @type Boolean
		 */
		multiSelectDevices: true,

		/**
		 * Allow multiple selection of geofences
		 * @type Boolean
		 */
		multiSelectGeofences: true
	},

/**
	* @construct
	* @private
	*/
	initialize: function() {
		// setting items
		this.setItems(this.getPanelsCfg());
		// call parent
		this.callParent(arguments);
	},

/**
	* Get items (panels) configs
	* @private
	*/
	getPanelsCfg: function() {
		var panels = [];
		C.utils.each({
			'mon_device': {
				title: _('Devices'),
				multiSelect: this.getMultiSelectDevices()
			},
			'mon_geofence': {
				title: _('Geofences'),
				multiSelect: this.getMultiSelectGeofences()
			}
		}, function(config, alias) {
			panels.push({
				xtype: 'grouplist',
				itemAlias: alias,
				title: config.title,
				multiSelectObjects: config.multiSelect
			});
			if (!this.panels) { this.panels = []; }
			this.panels.push(alias);
		}, this);
		return panels;
	}
});
