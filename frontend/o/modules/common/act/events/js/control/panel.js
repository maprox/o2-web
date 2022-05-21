/**
 * @class O.common.act.events.Panel
 */
C.utils.inherit('O.common.act.events.Panel', {

/**
	* @constructs
	* @param {Object} config Объект конфигурации
	*/
	initComponent: function() {
		this.callOverridden(arguments);
		var tb = this.down('periodchooser');
		if (tb) {
			tb.on('load', 'reload', this);
		}
	},

/**
	* Loads data for the period
	* @param {Object} period {sdt, edt}
	* @param {Function} resultCallback
	*/
	reload: function(period, resultCallback) {
		this.gridEvents.load(period.sdt, period.edt);
		resultCallback(true);
	}
});
