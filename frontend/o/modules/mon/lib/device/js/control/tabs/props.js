/**
 * @class O.mon.lib.device.tab.Props
 */
C.utils.inherit('O.mon.lib.device.tab.Props', {
/**
	* Initialization
	*/
	initComponent: function() {
		this.callOverridden(arguments);
		this.on('recordload', 'onRecordLoad', this);

		var fieldProtocol = this.findField('protocol');
		if (fieldProtocol) {
			fieldProtocol.on('change', 'onProtocolChange', this);
		}
		if (this.configureByKey) {
			this.configureByKey.on('click', 'onConfigureByKey', this);
		}
		if (this.sendSettingsKey) {
			this.sendSettingsKey.on('click', 'onSendSettingsKey', this);
		}
	},

/**
	 * On configure by key button click
	 */
	onConfigureByKey: function() {
		// Remove hint
		O.msg.removeByKey('hint_enter_settings_key');

		// Display or hide fields
		this.settingsKey.setVisible(!this.settingsKey.isVisible());
		this.sendSettingsKey.setVisible(!this.sendSettingsKey.isVisible());
	},

/**
	 * Request settings from backend
	 */
	onSendSettingsKey: function() {
		var me = this;
		var key = this.settingsKey.getValue();

		this.setLoading(true);

		// Send ajax query
		Ext.Ajax.request({
			url: '/mon_device/settingsbykey',
			method: 'get',
			params: {
				key: key
			},
			scope: this,
			success: function(response) {
				if (response) {
					var answer = Ext.decode(response.responseText);
					if (answer.success) {
						if (answer.data && answer.data.identifier) {
							this.applySettings(answer.data);
							me.resetConfigureByKey();
						} else {
							O.msg.warning(_(
								'The key is not found. Please check your input.'
							));
						}
					}
				}
				me.setLoading(false);
			}
		});
	},

/**
	 * Applies received by settings key settings
	 */
	applySettings: function(data) {
		this.fireEvent('actionrequest', 'applysettings', data);
	},

/**
	 * Reset configure by key related fields
	 */
	resetConfigureByKey: function() {
		this.settingsKey.setValue(null);
		this.settingsKey.setVisible(false);
		this.sendSettingsKey.setVisible(false);
	},

/**
	* Record loading handler
	*/
	onRecordLoad: function(cmp, record) {
		// Check if another record selected
		var firstTime = true;
		if (this.lastLoadedRecord
				&& record.getId() == this.lastLoadedRecord.getId())
		{
			firstTime = false;
		}
		this.lastLoadedRecord = record;

		if (record.get('foreign')) {
			if (firstTime) {
				// TEMP START
				if (C.getSetting('p.login') != 'тестовый') {
				// TEMP END
					this.deviceOwner.show();
					// Load owner information from history
					this.loadOwnerData();
				// TEMP START
				}
				// TEMP END
			}
		} else {
			this.deviceOwner.hide();
		}

		var isEditable = record.get('iseditable');
		this.settingsKey.setVisible(isEditable);
		this.sendSettingsKey.setVisible(isEditable);
		this.configureByKey.setVisible(isEditable);

		// Hide settings by key
		if (firstTime) {
			this.resetConfigureByKey();
		}
	},

/**
	* Loads owner data
	*/
	loadOwnerData: function() {
		var record = this.getSelectedRecord();
		this.deviceOwner.setLoading(true);
		Ext.Ajax.request({
			url: '/mon_device/ownerinfo',
			method: 'GET',
			params: {
				id_device: record.get('id')
			},
			callback: function(opts, success, response) {
				this.deviceOwner.setLoading(false);
				if (!success) {
					return;
				}

				var answer = C.utils.getJSON(response.responseText, opts);
				if (answer.data) {
					var data = answer.data;
					if (data.length) {
						var selected = this.getSelectedRecord();
						var owner = data[0];
						var selectedId = selected.get('id');
						if (selectedId !== owner.id_object &&
							selectedId !== owner.id) {
							this.deviceOwner.hide();
							return;
						}
						this.ownerStore.loadData(data);
					} else {
						this.deviceOwner.hide();
					}
				} else {
					this.deviceOwner.hide();
				}
			},
			scope: this
		});
	},

/**
	* Returns formated time string
	*/
	convertTime: function(time) {
		if (typeof(time) == 'object') {
			return Ext.util.Format.date(
				time.pg_utc(C.getSetting('p.utc_value')),
				O.format.Timestamp);
		} else {
			return Ext.util.Format.date(
				new Date().pg_fmt(time).pg_utc(C.getSetting('p.utc_value')),
				O.format.Timestamp);
		}
	},

/**
	* On protocol change
	*/
	onProtocolChange: function(cmp, value) {
		var record = cmp.store.getById(value);
		var alias = null;

		if (record) {
			alias = record.get('alias');
		}

		this.fireEvent('actionrequest', 'protocolchange', { tracker: alias });
	}
});