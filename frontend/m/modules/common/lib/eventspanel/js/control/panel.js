/**
 * @class M.common.lib.events.Panel
 */
C.utils.inherit('M.common.lib.events.Panel', {
	/**
	 * @construct
	 * @override
	 */
	initialize: function() {
		// call overridden
		this.callOverridden(arguments);
		var dt = new Date();
		this.loadPeriod({
			sdt: Ext.Date.clearTime(dt, true),
			edt: dt
		});
	},

/**
	* Load events according to supplied params
	* @param {Object} params
	*/
	loadPeriod: function(params) {
		var store = this.getStore();
		if (!store) { return; }
		var format = 'Y-m-d H:i:s';
		store.getProxy().setExtraParams({
			begin: Ext.Date.format(params.sdt, format),
			end: Ext.Date.format(params.edt, format)
		});
		store.load({limit: 1000000});
	}
});