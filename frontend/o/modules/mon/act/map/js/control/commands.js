/*
 * @class O.mon.act.map.Commands'
 */
C.utils.inherit('O.mon.act.map.Commands', {

/**
	* @constructs
	* @param {Object} config Объект конфигурации
	*/
	initComponent: function() {
		this.callParent(arguments);
		// init variables
		//this.grid = this.down('gridpanel');

		// Bind updates
		C.bind('mon_device_command', this);
		C.bind('mon_device_command_template', this);
	},

/**
	 * Send column renderer
	 */
	sendRenderer: function(value, m, record) {
		var me = this;

		var text = _('Send');
		var disabled = false;

		// If command sent we will wait for the result
		// and not allow user to send it again
		var lastCommand = record.get('last_command');
		if (lastCommand && lastCommand.status == C.cfg.STATUS_SENT) {
			text = _('Sent');
			disabled = true;
		}

		return {
			text: text,
			itemId: 'sendButton',
			xtype: 'button',
			disabled: disabled,
			record: record,
			handler: me.onSendCommand,
			scope: this
		}
	},

/**
	 * Command send handler
	 */
	onSendCommand: function(btn) {
		var me = this;

		btn.disable();
		btn.setText(_('Sent'));

		this.setLoading(true);
		var record = btn.record;

		// Send
		var data = {
			id_device: this.currentDevice.id,
			command: record.get('id_command_type$name'),
			transport: record.get('transport') || null,
			id_command_template: record.get('id'),
			params: record.get('params')
		}

		Ext.Ajax.request({
			url: '/mon_device_command/send',
			method: 'post',
			params: data,
			scope: this,
			success: function(response) {
				var answer = Ext.JSON.decode(response.responseText);

				if (answer.success) {
					O.msg.info(_('Command has been sent'));
				} else {
					O.msg.error(_('Error'));
				}

				me.setLoading(false);
			}
		});
	},

	/**
	 * On mon_device_command update
	 */
	onUpdateMon_device_command: function(data) {
		var item = data[0];

		// Check if update for selected device
		if (!this.currentDevice) {
			return;
		}
		if (!item.id_command_template) {
			return;
		}

		if (this.currentDevice.id !== item.id_device) {
			return;
		}

		// Reload template store
		this.templatesStore.load();
	},

	/**
	 * On mon_device_command_template_update
	 */
	onUpdateMon_device_command_template: function(data) {
		var item = data[0];

		// Check if update for selected device
		if (!this.currentDevice) {
			return;
		}

		if (this.currentDevice.id !== item.id_device) {
			return;
		}

		// Reload template store
		this.templatesStore.load();
	},

	/**
	 * Sets current device
	 * @param {O.mon.model.Device} device
	 */
	setDevice: function(device) {
		// Check if first time
		if (this.currentDevice && device.id === this.currentDevice.id) {
			this.currentDevice = device;
			return;
		}

		// First time
		this.currentDevice = device;

		// Load commands
		// Load commands templates
		this.templatesStore.getProxy().extraParams = {
			'$filter': 'id_device EQ ' + device.id,
			'$joined': 1,
			'$showtotalcount': 1
		};
		this.templatesStore.load();
	}
})
