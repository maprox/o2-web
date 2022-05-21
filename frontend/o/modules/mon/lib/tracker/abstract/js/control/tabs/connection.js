/**
 * @class
 */
C.utils.inherit('O.mon.lib.tracker.abstract.tab.Connection', {
/**
	* Initialization
	*/
	initComponent: function() {
		this.callOverridden(arguments);
		if (this.canBeConfiguredBySms) {
			if (C.userHasRight('mon_device', C.manager.Auth.$CAN_WRITE)) {
				this.btnConfigure = this.addConfigureButton();
			}
			if (this.btnConfigure) {
				this.btnConfigure.setHandler(this.onBtnConfigureClick, this);
			}
		}
	},

/**
	* On record load
	*/
	onRecordLoad: function(t, record) {
		if (this.btnConfigure) {
			if (!record.get('iseditable')) {
				this.btnConfigure.hide()
			} else {
				this.btnConfigure.show();
			}
		}
		this.callParent(arguments);
	},

/**
	* btnConfigure click handler
	* @private
	*/
	onBtnConfigureClick: function() {
		var message = _('SMS will be sent to set up the tracker.') +
			'<br />' +
			_('Make sure that tracker is connected to the power cord, and ' +
			  'has SIM-card with positive balance inserted.') +
			'<br />' +
			_('Device settings will be saved.');
			_('Continue?');
		O.msg.confirm({
			msg: message,
			fn: function(buttonId) {
				if (buttonId != 'yes') { return; }
				this.ownerCt.fireEvent('saverequest', this.doConfigure, this);
			},
			scope: this
		});
	},

/**
	* Device configure action
	*/
	doConfigure: function() {
		var record = this.ownerCt.getSelectedRecord();
		if (!record) { return; }
		var data = {
			id: record.getId()
		};
		this.ownerCt.setLoading(true);
		Ext.Ajax.request({
			url: '/mon_device/configure',
			method: 'GET',
			params: {
				data: Ext.JSON.encode(data)
			},
			callback: function(opts, success, response) {
				this.ownerCt.setLoading(false);
				if (!success) { return; }
				// response from server
				var answer = C.utils.getJSON(response.responseText, opts);
				if (answer.success) {
					O.msg.info(_('The task of configuring the device ' +
						'is successfully created'));
				} else {
					O.msg.warning(_('An error occurred while trying to ' +
						'create device configuration task'));
				}
			},
			scope: this
		});
	}

});
