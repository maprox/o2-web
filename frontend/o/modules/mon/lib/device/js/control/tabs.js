/**
 * @class O.mon.lib.device.Tabs
 */
C.utils.inherit('O.mon.lib.device.Tabs', {

/**
	 * constructor
	 */
	initComponent: function() {
		this.callParent(arguments);

		// Default sensors that could be created
		// They will be filtered by protocol
		this.defaultSensors = {
			'acc': {
				'name': _('Ignition'),
				'param': 'acc',
				'unit': _('On') + C.cfg.unitDelimiter + _('Off'),
				'conversion': []
			},
			'ext_battery_connected': {
				'name': _('External power supply'),
				'param': 'ext_battery_connected',
				'unit': _('Available') + C.cfg.unitDelimiter + _('Missing'),
				'conversion': []
			},
			'ext_battery_level': {
				'name': _('Battery level'),
				'param': 'ext_battery_level',
				'unit': '%',
				'convert': 1,
				'display': 1,
				'conversion': [{
					'x': '1',
					'y': '100'
				}, {
					'x': '0',
					'y': '0'
				}]
			}
		}
	},


/**
	* Загрузка модели в табпанель
	* @param {Object} record Объект устройства
	* @param {Boolean} noReset (optional) If true, use field.setValue method
	*     for forms to disable dirty change. Defaults to false
	* @type {Function}
	*/
	loadRecord: function(record, noReset) {
		// Disbale tabs for readonly record
		if (record && !record.get('iseditable')) {
			this.tabs.child('#sensors').disable();
			this.tabs.child('#commands').disable();
			this.tabs.child('#packets').disable();
		} else {
			this.tabs.child('#sensors').enable();
			this.tabs.child('#commands').enable();
			this.tabs.child('#packets').enable();
		}

		if (!record || record.get('isshared')) {
			this.disableSettings();
		} else {
			var protocolStore = C.getStore('mon_device_protocol');
			var tracker = protocolStore.getById(record.get('protocol'));

			if (tracker) {
				this.enableSettings(tracker.alias);
			} else {
				this.disableSettings();
			}
		}
		this.callParent(arguments);
	},

/**
	 * Enables settings and connection tabs
	 */
	enableSettings: function(tracker) {
		if (!tracker) { return; }
		this.tabs.down('mon-lib-device-tab-connection').getLayout()
			.setActiveItem(tracker);
		this.tabs.down('mon-lib-device-tab-settings').getLayout()
			.setActiveItem(tracker);
		this.tabs.child('#settings').enable();
		this.tabs.child('#connection').enable();
	},

/**
	 * Disables settings and connection tabs
	 */
	disableSettings: function() {
		this.tabs.child('#settings').disable();
		this.tabs.child('#connection').disable();
	},

/**
	* Save button handler
	* @type {Function}
	*/
	saveChanges: function() {
		var me = this;
		var record = this.getSelectedRecord();
		if (!record) { return; }
		this.updateRecord(record);

		var defaultSensors = me.getDefaultSensors(record);
		// If protocol has been changed
		// Ask for sensor creation
		if (record.modified.protocol !== undefined && defaultSensors.length) {
			var message =
				_('Would you like to create default sensors'
					+ ' for selected protocol?');
			O.msg.confirm({
				msg: _(message),
				fn: function(choice) {
					if (choice === 'yes') {

						// Set sensors
						record.set('sensor', defaultSensors);

						this.save(function() {
							// Reload sensors tab
							this.tabs.child('#sensors').loadSensors();
						}, me);
					} else {
						this.save();
					}
				},
				scope: this
			});
		} else {
			this.save();
		}
	},

/**
	 * Get default sensors
	 * @param record
	 */
	getDefaultSensors: function(record) {
		var protocolStore = C.getStore('mon_device_protocol');
		var protocol = protocolStore.getById(record.get('protocol'));
		// Defaults sensors
		var defaults = [];
		var sensors = protocol.get('sensors');
		if (sensors) {
			for (var i = 0; i < sensors.length; i++) {
				var sensor = sensors[i];
				if (this.defaultSensors[sensor.name]) {
					defaults.push(this.defaultSensors[sensor.name]);
				}
			}
		}
		return defaults;
	},

/**
	 * On action request
	 */
	onActionRequest: function(action, params) {
		if (action == 'protocolchange') {
			// get settings tab layout
			if (params.tracker !== null && !this.selected.get('isshared')) {
				this.enableSettings(params.tracker);
			} else {
				this.disableSettings();
			}

			return;
		}

		// Apply settings that requested by settings key from mon_sim_card
		if (action == 'applysettings') {
			// Set protocol
			this.tabs.child('#properties').protocol.select(params.protocol);

			var connection
				= this.tabs.child('#connection').getLayout().getActiveItem();
			var connectionPanel = connection.down('#connectionPanel');

			// Set identifier
			var identifierField = connectionPanel.getComponent(
				connection.itemId + '.identifier'
			);
			identifierField.setValue(params.identifier);

			// Set phone
			var phoneField = connectionPanel.getComponent(
				connection.itemId + '.phone'
			);
			phoneField.setValue(params.phone);

			// Set provider
			var providerField = connectionPanel.getComponent(
				connection.itemId + '.provider'
			);
			providerField.setValue(params.provider);
		}

		if (action == 'disableaccess') {
			this.tabs.child('#access').disable();

			return;
		}

		if (action == 'enableaccess') {
			this.tabs.child('#access').enable();

			return;
		}

		if (action == 'setdevicesensors') {
			this.tabs.child('#properties').setDeviceSensors(params.sensors)
		}
	}
});
