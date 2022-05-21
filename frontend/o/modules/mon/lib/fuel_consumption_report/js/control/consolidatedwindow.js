/**
 * @class O.mon.lib.fuel.consumption.report.ConsolidatedWindow
 * @extends O.common.lib.modelslist.EditorWindow
 */
C.utils.inherit('O.mon.lib.fuel.consumption.report.ConsolidatedWindow', {

/**
	* @constructor
	*/
	initComponent: function() {
		this.callOverridden(arguments);
		if (this.btnPrint) {
			this.btnPrint.setHandler(this.onPrintClick, this);
		}
		if (this.btnCancel) {
			this.btnCancel.setHandler(this.hide, this);
		}
	},

/**
	* Execute
	*/
	execute: function() {
		this.show();
	},

/**
	* Handler of print button click
	* @private
	*/
	onPrintClick: function() {
		var fmt = 'Y-m-d H:i:s';
		var date = C.utils.fmtDate(this.fieldDate.getValue(), fmt);

		// Check input params
		if (!date) {
			O.msg.info(_('You need to specify date'));
			return;
		}

		this.setLoading(true);
		this.fireEvent('print', this, date);
	}
});