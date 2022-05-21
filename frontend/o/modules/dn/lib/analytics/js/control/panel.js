/**
 * @class O.dn.lib.analytics.Panel
 */
C.utils.inherit('O.dn.lib.analytics.Panel', {
/**
	 * constructor
	 */
	initComponent: function() {
		this.callOverridden(arguments);
		// hide on/off button
		if (this.list && this.list.btnOnOff) {
			this.list.btnOnOff.setVisible(false);
		}
	}
});
