/**
 * @copyright  2012, Maprox LLC
 */
/**
 * Device information panel
 * @class M.lib.deviceinfo.CommandsPanel
 * @extend C.ui.Panel
 */
C.utils.inherit('M.lib.deviceinfo.CommandsPanel', {

/**
	* @construct
	*/
	initialize: function() {
		var me = this;
		// call parent
		this.callParent(arguments);

		// Bind updates
		C.bind('mon_device_command', this);
		C.bind('mon_device_command_template', this);
	},

	/**
	* Sets device instance (or device identifier)
	* for displaying information about it
	* @param {O.mon.model.Device/Number} device
	*/
	setDevice: function(device) {
		var id = null;
		if (Ext.isNumber(device)) {
			id = device;
		}
		if (device instanceof O.mon.model.Device) {
			id = device.getId();
		}
		if (id && (id !== this.deviceId)) {
			this.deviceId = device;

			this.templatesStore.getProxy().setExtraParams({
				'$filter': 'id_device EQ ' + this.deviceId,
				'$joined': 1,
				'$showtotalcount': 1
			});

			// Load templates store
			this.templatesStore.load();
		}
	},


	/**
	 * Loads templates
	 */
	loadTemplates: function() {
		this.templatesStore.load(function(records) {
			Ext.Array.each(records, function(rec) {
				// We need this because sencha touch
				// does not apply model convert method by itself
				rec.set('status', rec.get('status'));
				rec.set('button_text', rec.get('button_text'));
				rec.set('button_disabled', rec.get('button_disabled'));
			});
		});
	},

	/**
	 * On mon_device_command update
	 */
	onUpdateMon_device_command: function(data) {
		var me = this;
		var item = data[0];

		// Check if update for selected device
		if (!this.deviceId) {
			return;
		}
		if (!item.id_command_template) {
			return;
		}

		if (this.deviceId !== item.id_device) {
			return;
		}

		// Reload template store
		this.loadTemplates();
	},

	/**
	 * On mon_device_command_template_update
	 */
	onUpdateMon_device_command_template: function(data) {
		var item = data[0];

		// Check if update for selected device
		if (!this.deviceId) {
			return;
		}

		if (this.deviceId !== item.id_device) {
			return;
		}

		// Reload template store
		this.templatesStore.load();
	}
});
