/**
 * @class O.mon.lib.device.tab.Packets
 * @extends O.common.lib.modelslist.Tab
 */
C.utils.inherit('O.mon.lib.device.tab.Packets', {

/**
	* @constructor
	*/
	initComponent: function() {
		this.callParent(arguments);
		this.periodChooser = this.down('periodchooser');

		this.periodChooser.insert(this.periodChooser.items.length, [{
			xtype: 'tbfill'
		}, {
			xtype: 'button',
			itemId: 'clearPackets',
			text: _('Clear packets'),
			iconCls: 'devicestabfields_remove',
			hidden: !C.userHasRight('can_clear_packets')
		}]);

		if (this.periodChooser) {
			this.periodChooser.on('load', 'reload', this);
		}
		this.gridPanel = this.down('#packetsgrid');
		this.on('recordload', this.onRecordLoad, this);
		this.gridPanel.store.on('load', this.onPacketsLoad, this);

		this.btnClearPackets = this.down('#clearPackets');
		this.btnClearPackets.on('click', this.onClearPackets, this);
	},

/**
	 * On clear packets button click
	 */
	onClearPackets: function() {
		var me = this;

		var msg =
			_('Do you really want to completely remove all device packets?');
		msg += ' ' + _('You will not be able to cancel this action');

		var selected = this.getSelectedRecord();
		if (!selected) {
			return;
		}

		O.msg.confirm({
			msg: msg,
			fn: function(buttonId) {
				if (buttonId == 'yes') {
					me.setLoading(true);
					// Make backend request
					var params = {
						id_device: selected.get('id')
					};

					Ext.Ajax.request({
						url: '/mon_packet/clear',
						method: 'put',
						params: params,
						scope: this,
						success: function(response) {

							var answer = Ext.decode(response.responseText);

							me.setLoading(false);

							// Reload packets grid
							this.periodChooser.reload(true);

							if (answer && answer.success) {
								O.msg.info({
									msg:
										_('All device packets has been deleted')
								});
							}

						}
					});
				}
			},
			scope: this
		});
	},

/**
	* Loads data from record
	* @param {Ext.data.Model} record
	* @param {Boolean} noReset (optional) If true, use field.setValue method
	*     for forms to disable dirty change. Defaults to false
	*/
	selectRecord: function(record, noReset) {
		if (this.selectedRecord && this.selectedRecord.getId && record &&
			this.selectedRecord.getId() == record.getId()) { return; }
		this.selectedRecord = record;
		this.periodChooser.reload(true);
		this.fireEvent('recordload', this, record, noReset);
	},

/**
	* Returns selected record
	* @return {Ext.data.Model}
	**/
	getSelectedRecord: function() {
		return this.selectedRecord;
	},

/**
	* On record load
	*/
	onRecordLoad: function() {
		//this.periodChooser.reload(true);
	},

/**
	* On packets load
	*/
	onPacketsLoad: function(t, records) {
		var device = this.getSelectedRecord();
		var deviceSensors = device.get('sensor');
		if (!deviceSensors && !deviceSensors.length) {
			return;
		}
		if (records && records.length) {
			// Columns
			var columns = Ext.clone(this.columnsArray);
			Ext.Array.each(deviceSensors, function(sensor, index) {
				// Add columns only for active device sensors
				if (sensor.state == C.cfg.RECORD_IS_ENABLED) {
					columns.push({
						header: sensor.name,
						dataIndex: 'sensor_' + sensor.param + sensor.id
					});
				}
			});

			Ext.Array.each(records, function(record, index) {
				var recordSensors = record.get('sensor');
				if (recordSensors && recordSensors.length) {
					Ext.Array.each(recordSensors, function(s, i) {
						var sensorValue = s.val;
						if (s.val_conv) {
							//sensorValue += ' &minus;> ' + s.val_conv;
							sensorValue += ' &rarr; ' + s.val_conv;
						}
						record.data['sensor_' + s.sensor + s.id_device_sensor]
							= sensorValue;

					});
				}
			});

			this.gridPanel.reconfigure(null, columns);
		}
	},

/**
	* Loads packets into grid
	*/
	reload: function(period, resultCallback) {
		var record = this.getSelectedRecord();
		if (!record) {
			return;
		}
		var filter = 'event_dt ge ' + C.utils.fmtUtcDate(period.sdt) +
			' and event_dt le ' + C.utils.fmtUtcDate(period.edt) +
			' and id_device eq ' + record.get('id');
		this.gridPanel.store.getProxy().extraParams = {
			$filter: filter,
			$showtrashed: true,
			$showtotalcount: 1
		};
		this.gridPanel.store.loadPage(1);
		resultCallback(true);
	}

});
