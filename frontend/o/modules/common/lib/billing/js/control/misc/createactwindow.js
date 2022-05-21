/**
 * @class O.common.lib.billing.CreateActWindow
 */
C.utils.inherit('O.common.lib.billing.CreateActWindow', {

/**
	* @constructor
	*/
	initComponent: function() {
		this.callOverridden(arguments);
		if (this.btnCreate) {
			this.btnCreate.setHandler(this.onCreateClick, this);
		}
		if (this.btnCancel) {
			this.btnCancel.setHandler(this.hide, this);
		}
		this.on('afterrender', 'onAfterRender', this);
	},

/**
	* On after render handler
	* @private
	*/
	onAfterRender: function() {
		if (!this.fieldDate) { return; }
		var now = new Date();
		var lastDayOfPreviousMonth =
			now.getFirstDateOfMonth().add(Ext.Date.DAY, -1);
		this.fieldDate.setValue(lastDayOfPreviousMonth);
	},

/**
	* Handler of 'Export' button click
	* @private
	*/
	onCreateClick: function() {
		// prepare parameters
		var firmId = this.firmid || C.getSetting('f.id');
		var fmt = 'Y-m-d H:i:s';
		var date = C.utils.fmtDate(this.fieldDate.getValue(), fmt);
		// send the request
		this.setLoading(true);
		Ext.Ajax.request({
			url: '/dn_act/generate',
			method: 'POST',
			params: {
				firm: firmId,
				date: date
			},
			callback: function(opts, success, response) {
				this.setLoading(false);
				var packet = C.utils.getJSON(response.responseText, opts);
				if (success && packet.success && packet.data) {
					this.hide();
					this.fireEvent('aftercreate', this, packet.data.id);
				}
			},
			scope: this
		});
	}
});