/**
 * @class O.mon.trackhistory.Sensors
 */
C.utils.inherit('O.mon.trackhistory.Sensors', {

	/**
	* @constructor
	*/
	initComponent: function() {
		var me = this;

		// Default conditions data
		this.defaultConditions = [{
			id: '=',
			name: _('Equals')
		}, {
			id: '<>',
			name: _('Not equals')
		}, {
			id: '>',
			name: _('Bigger than')
		}, {
			id: '<',
			name: _('Lower than')
		}];

		// Parent constructor
		this.callOverridden(arguments);

		// Events
		this.sensorsGrid.on('beforeedit', 'onGridBeforeEdit', this);
		this.sensorsGrid.on('canceledit', 'onGridCancelEdit', this);
		this.sensorsGrid.on('edit', 'onGridEdit', this);
		if (this.columnDisplay) {
			this.columnDisplay.on('checkchange', 'onDisplayChange', this)
		}
	},

/**
	* When need to reload sensors because of some update from socket
	* @param {Object[]} data
	*/
	reloadSensors: function(data) {
		var me = this;

		// Set proxy dirty
		// TODO: not allways may be set to dirty?
		var proxy =
			O.manager.Model.getProxy('mon_device_sensor_history_setting');
		proxy.setDirty();

		// If any row is not editing now
		if (!this.editing) {
			// Load sensors again
			this.loadSensors(this.lastLoadParams);

			return;
		}

		// Some row is editing now, set flag needReload
		// When editing is done or canceled sensors will be reloaded
		this.needReload = true;
	},

/**
	 * Hides notice panel
	 */
	hideNotice: function() {
		this.noticePanel.hide();
	},

/**
	 * Displays notice panel
	 */
	displayNotice: function() {
		var display = false;
		this.gridStore.each(function(s) {
			if (s.get('display')) {
				display = true;
				return false
			}
		});

		if (!display) {
			this.hideNotice();
			return;
		}
		this.noticePanel.show();
	},

/**
	* On display change
	* @param column
	* @param rowIndex
	* @param checked
	*/
	onDisplayChange: function(column, rowIndex, checked) {
		// Editing flag
		this.editing = true;
		// first unceck other checked values
		var selected = this.gridStore.getAt(rowIndex);
		// Unhecked records
		var unchecked = 0;
		this.gridStore.each(function(record) {
			if (record.get('display')
				&& (record.get('id') !== selected.get('id')))
			{
				unchecked++;
				record.set('display', false);

				// Save uncheck
				this.saveSettingRecord(record, function() {
					// Save check selected and draw map
					this.saveSettingRecord(selected, this.mapDraw, this);
				}, this);

				// Only one record could be checked
				return false;
			}
		}, this);

		// If no record has been unchecked
		if (!unchecked) {
			// Save selected record and draw map
			this.saveSettingRecord(selected, this.mapDraw, this);
		}
	},

/**
	* This function called when need to draw sensors on map
	*/
	mapDraw: function() {
		// Editing complite
		this.editing = false;

		var sensors = [];
		this.gridStore.each(function(sensor) {
			if (sensor.get('display') == true) {
				sensors.push(sensor);
			}
		});
		this.fireEvent('drawsensors', sensors);

		// If need reload sensors
		if (this.needReload) {
			this.needReload = false;
			this.loadSensors(this.lastLoadParams);
		}
	},

/**
	 * Before edit frid row handler
	 * @param Type editor
	 * @param Type e
	 */
	onGridBeforeEdit: function(editor, e) {
		// Editing flag
		this.editing = true;

		var record = e.record;
		var valueField = editor.editor.getForm().findField('value');

		if (record.get('is_digital')) {
			valueField.disable();
			var unitParts = C.utils.parseUnit(record.get('unit'));
			this.conditionStore.loadData([{
				id: '1',
				name: unitParts[0]
			}, {
				id: '0',
				name: unitParts[1]
			}]);
		} else {
			valueField.enable();
			this.conditionStore.loadData(this.defaultConditions);
		}

		return true;
	},

	/**
	 * Cancel edit handler
	 * TODO: comment this!
	 */
	onGridCancelEdit: function(editor, e) {
		this.editing = false;
		if (this.needReload) {
			this.needReload = false;
			this.loadSensors(this.lastLoadParams);
		}
	},

/**
	* On grid entry edited
	* @param Type editor
	* @param Type e
	*/
	onGridEdit: function(editor, e) {
		// Editing flag
		this.editing = true;

		var me = this;
		var selected = e.record;

		// Unchecked records counter
		var unchecked = 0;
		// Uncheck checked record first if display value changed
		if (selected.modified && selected.modified.display !== undefined) {
			this.gridStore.each(function(record) {
				if (record.get('display')
					&& (record.get('id') !== selected.get('id')))
				{
					unchecked++;
					record.set('display', false);

					// Save uncheck
					this.saveSettingRecord(record, function() {
						// Save check selected and draw map
						this.saveSettingRecord(selected, this.mapDraw, this);
					}, this);

					// Only one record could be checked
					return false;
				}
			}, this);
		}

		// if nothing unchecked just save selected record
		if (!unchecked) {
			// Save selected record and draw map
			this.saveSettingRecord(selected, this.mapDraw, this);
		}
	},

/**
	* Actually saves record or inserts new
	* @param record
	*/
	saveSettingRecord: function(record, callback, scope) {
		var me = this;
		this.setLoading(true);

		var data = {
			condition: record.get('condition'),
			display: +record.get('display'),
			value: +record.get('value'),
			// TODO: need backend check?
			id_device_sensor: record.get('id_sensor')
		};
		if (!record.get('id')) {
			O.manager.Model.add('mon_device_sensor_history_setting', data,
				function(success, opts) {
					if (success) {
						me.setLoading(false);
						record.set('id', opts.data.id);
						record.commit();
						if (callback) {
							callback.apply(scope);
						}
					} else {
						me.setLoading(false);
					}
			}, this);
		} else {
			data.id = record.get('id');
			O.manager.Model.set('mon_device_sensor_history_setting', data,
				function(success, opts) {
					if (success) {
						me.setLoading(false);
						record.commit();
						if (callback) {
							callback.apply(scope);
						}
					} else {
						me.setLoading(false);
					}
			}, this);
		}
	},

/**
	* Load sensors to grid panel
	* @param loadParams
	* @param data
	*/
	loadSensors: function(loadParams, data) {
		var me = this;

		this.setLoading(true);

		this.lastLoadParams = loadParams;

		// Get selected device
		var deviceId = loadParams.deviceId;
		var deviceStore = C.getStore('mon_device');
		var device = deviceStore.getById(deviceId);

		if (!device) {
			me.gridStore.removeAll();
			this.setLoading(false);
			return;
		}

		// Load data to grid store
		var sensors = device.get('sensor');
		if (!sensors) {
			me.gridStore.removeAll();
			this.setLoading(false);
			return;
		}
		if (!sensors.length) {
			me.gridStore.removeAll();
			this.setLoading(false);
			return;
		}

		// Collect deviceSensorIds
		var deviceSensorIds = [];
		Ext.each(sensors, function(s) {
			// Skip disabled sensors
			if (s.state !== C.cfg.RECORD_IS_ENABLED) {
				return true;
			}

			deviceSensorIds.push(s.id);
		});

		// Load sensor history settings for device
		C.get('mon_device_sensor_history_setting', function(settings) {
			var storeData = [];
			Ext.Array.each(sensors, function(sensor) {

				// Skip disabled sensors
				if (sensor.state !== C.cfg.RECORD_IS_ENABLED) {
					return true;
				}

				// get settings for this sensor
				var setting = null;
				settings.each(function(s) {
					if (s.id_device_sensor == sensor.id) {
						setting = s;
						return false;
					}
				}, this);

				// Parse unit to know if sensor is digital
				var unitParts = C.utils.parseUnit(sensor.unit);

				// Value
				// If sensor is digital value is ''
				var value = setting ? setting.value : '';
				if (unitParts.length) {
					// if digital sensor
					// then value should be empty and not editable
					value = '';
				}

				// Condition
				// If sensor is digital, 0 = off, any = 1 = on
				var condition = setting ? setting.condition : '1';
				// Because sensor unit may have changed but not condition
				// cast condition
				if (unitParts.length && condition !== '0') {
					condition = '1';
				}
				// If not digital sensor but old condition values presents
				// cast condition
				if (!unitParts.length
					&& (condition == '0' || condition == '1'))
				{
					condition = '=';
				}

				storeData.push({
					'id': setting ? setting.id : 0,
					'id_sensor': sensor.id,
					'name': sensor.name,
					'unit': sensor.unit,
					'is_digital': !!unitParts.length,
					'display': setting ? setting.display : '0',
					'condition': condition,
					'value': value
				});
			});

			me.gridStore.loadData(storeData);

			// call mapDraw
			me.mapDraw();

			me.setLoading(false);
		}, this, {
			'$filter': 'id_device_sensor IN ('
				+ deviceSensorIds.join(', ') + ')'
		});
	}
});