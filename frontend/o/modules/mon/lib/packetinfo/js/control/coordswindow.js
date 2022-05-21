/**
 * @class O.mon.lib.packetinfo.CoordsWindow
 */
C.utils.inherit('O.mon.lib.packetinfo.CoordsWindow', {
/**
	* @constructor
	*/
	initComponent: function() {
		this.callParent(arguments);

		this.btnSet = this.down('#btnSet');
		this.btnCancel = this.down('#btnCancel');
		this.fieldLat = this.down('#latitude');
		this.fieldLon = this.down('#longitude');

		if (this.btnSet) {
			this.btnSet.on('click', this.onSet, this);
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
	onSet: function() {
		var me = this;

		this.setLoading(true);

		var packetData = {
			id_device: this.deviceId,
			latitude: me.fieldLat.getValue(),
			longitude: me.fieldLon.getValue(),
			id_type: C.cfg.packetType.STATIC_POINT,
			time: Ext.Date.format(
				new Date().toUtc(),
				'Y-m-d H:i:s'
			)
		};

		O.manager.Model.add('mon_packet', packetData,
			function(success, opts) {
				if (success) {
					O.msg.info(_('The coordinates has been successfully set'));
					me.setLoading(false);
					me.fireEvent('packetcreated');
					me.destroy();
				} else {
					me.setLoading(false);
				}
			}, this);
	}
});