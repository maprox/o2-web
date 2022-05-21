/**
 * @class O.common.lib.shareaccess.ShareWindow
 */
C.utils.inherit('O.common.lib.shareaccess.ShareWindow', {

/**
	* @constructor
	*/
	initComponent: function() {
		this.callParent(arguments);

		this.btnShare = this.down('#btnShare');
		this.btnCancel = this.down('#btnCancel');
		this.fieldKey = this.down('#fieldKey');

		if (this.btnShare) {
			this.btnShare.on('click', this.onShare, this);
		}

		if (this.btnCancel) {
			this.btnCancel.on('click', this.onCancel, this);
		}
	},

/**
	 * On cancel
	 */
	onCancel: function() {
		// Destroy this window
		this.destroy();
	},

/**
	 * On share
	 */
	onShare: function() {
		var me = this;
		this.setLoading(true);
		// Checking given share key
		Ext.Ajax.request({
			url: '/x_firm/searchkey',
			method: 'GET',
			params: {
				share_key: me.fieldKey.getValue()
			},
			success: function(response, opt) {
				var answer = C.utils.getJSON(response.responseText);

				if (answer.success) {
					if (answer.data && answer.data.length) {
						var firm = answer.data[0];
						me.fireEvent('firmloaded', firm);
						me.destroy();
					} else {
						me.fieldKey.markInvalid(_('Firm was not found'));
					}
				} else {
					O.msg.error(_('Server error'));
				}
				me.setLoading(false);
			}
		});
	}
});