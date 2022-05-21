/**
 * @class O.common.lib.billing.ExportWindow
 */
C.utils.inherit('O.common.lib.billing.ExportWindow', {

/**
	* @constructor
	*/
	initComponent: function() {
		this.callOverridden(arguments);
		if (this.btnExport) {
			this.btnExport.setHandler(this.onExportClick, this);
		}
		if (this.btnCancel) {
			this.btnCancel.setHandler(this.onCancelClick, this);
		}
		this.on('afterrender', 'onAfterRender', this);
	},

/**
	* On after render handler
	* @private
	*/
	onAfterRender: function() {
		var curMonthNum = new Date().getMonth();
		var buttons = this.query('button[alias=month]');
		Ext.each(buttons, function(button) {
			var offset = button.offset || 0;
			var monthNum = curMonthNum + offset;
			if (monthNum < 0) {
				monthNum += 12; // 12 monthes in a year
			}
			var monthName = Ext.Date.monthNames[monthNum];
			button.setText(monthName);
			button.on('toggle', 'monthBtnToggle', this);

			var now = new Date();
			var som = now.getFirstDateOfMonth().clearTime();
			var sdt = som.add(Ext.Date.MONTH, offset);
			var edt = sdt.add(Ext.Date.MONTH, 1).add(Ext.Date.DAY, -1);
			button.period = {edt: edt, sdt: sdt};

			if (offset === -1) {
				button.toggle();
			}
		}, this);
	},

/**
	* Handler of toggling of the month button
	* @param {Ext.button.Button} btn Toggled button
	* @private
	*/
	monthBtnToggle: function(btn) {
		if (!btn.pressed) { return; }
		this.fieldSdt.setValue(btn.period.sdt);
		this.fieldEdt.setValue(btn.period.edt);
	},

/**
	* Handler of 'Export' button click
	* @private
	*/
	onExportClick: function() {
		this.hide();
		var firmId = this.firmid || C.getSetting('f.id');
		var format = this.fieldFormat.getValue()['format'];
		var sdt = this.fieldSdt.getValue();
		var edt = this.fieldEdt.getValue().setEndOfADay(true);
		var fmt = 'Y-m-d H:i:s';
		window.open(Ext.String.format("/reports/export?data={0}",
			escape(Ext.encode({
				report: '/reports/observer/docsnet/billing_detailing',
				format: format,
				params: {
					firmid: firmId,
					period: {
						sdt: C.utils.fmtDate(sdt, fmt),
						edt: C.utils.fmtDate(edt, fmt)
					}
				}
			})))
		);
	},

/**
	* Handler for the 'Cancel' button click
	* @private
	*/
	onCancelClick: function() {
		this.hide();
	}
});