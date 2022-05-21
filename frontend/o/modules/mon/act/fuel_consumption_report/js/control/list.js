/**
 * @class O.mon.fuel.consumption.report.List
 */
C.utils.inherit('O.mon.fuel.consumption.report.List', {
/**
	* @constructor
	*/
	initComponent: function() {
		this.callParent(arguments);

		if (this.btnPrint) {
			this.btnPrint.setHandler(this.doPrintReport, this);
		}
		if (this.btnPrintСonsolidated) {
			this.btnPrintСonsolidated.setHandler(
				this.showConsolidatedDialog,
				this
			);
		}
		if (this.btnClose) {
			this.btnClose.setHandler(this.doCloseReport, this);
		}
		if (this.store) {
			this.store.on('load', this.onParentStoreLoad, this);
		}
	},

/**
	* Shows window for creating issue
	* @private
	*/
	addRecord: function() {
		this.getCreateWindow().execute();
	},

/**
	* Returns an create window
	* @return
	*/
	getCreateWindow: function() {
		if (!this.createWindow) {
			this.createWindow = Ext.widget(
				this.managerAlias + '-createwindow', {
					width: 460,
					firmId: this.firmId
				}
			);
			this.createWindow.on('create', this.onRecordCreate, this);
		}
		return this.createWindow;
	},

/**
	* Returns true if selected record is printable
	* @return {Boolean}
	*/
	isSelectedRecordPrintable: function() {
		var record = this.getSelectedRecord();
		var isRecordSelected = (record != undefined);
		return (isRecordSelected && record.getId() > 0);
	},

/**
	* Returns true if selected record closable
	*/
	isSelectedRecordClosable: function() {
		var record = this.getSelectedRecord();
		if (record && record.get('status') != C.cfg.STATUS_CLOSED) {
			return true;
		}

		return false;
	},

/**
	* User interface sync
	*/
	syncUi: function() {
		this.callParent(arguments);
		this.btnPrint.setDisabled(!this.isSelectedRecordPrintable());
		this.isSelectedRecordClosable();
		this.btnClose.setDisabled(
			!this.isSelectedRecordPrintable()
			|| !this.isSelectedRecordClosable()
		);
	},

/**
	* Closes report
	*/
	doCloseReport: function() {
		var record = this.getSelectedRecord();
		var data = {
			id: record.get('id'),
			status: C.cfg.STATUS_CLOSED
		};
		this.setLoading(true);
		O.manager.Model.set(this.managerAlias, data,
			function(success, object) {
				if (success) {
					// Info message
					O.msg.info(_('The report has been closed'));
				}
				// Disable loading
				this.setLoading(false);
				// Sync UI
				this.syncUi();
			},
			this
		);
	},

/**
	* Displays consolidated dialog
	*/
	showConsolidatedDialog: function() {
		if (!this.consolidatedWindow) {
			this.consolidatedWindow = Ext.widget(
				this.managerAlias + '-consolidatedwindow', {
					width: 460,
					firmId: this.firmId
				}
			);
			this.consolidatedWindow.on('print', this.doPrintConsolidated, this);
		}

		this.consolidatedWindow.execute();
	},

/**
	* Prints consolidated report
	*/
	doPrintConsolidated: function(win, date) {
		window.open(Ext.String.format("/reports/export?data={0}",
			escape(Ext.encode({
				report: '/reports/observer/fuel/consumption_1',
				format: 'PDF',
				params: {
					firmid: C.getSetting('f.id'),
					date: date
				}
			})))
		);

		win.setLoading(false);
		win.hide();
	},

/**
	* Prints selected report
	*/
	doPrintReport: function() {
		if (!this.isSelectedRecordPrintable()) { return; }
		var record = this.getSelectedRecord();
		window.open(Ext.String.format("/reports/export?data={0}",
			escape(Ext.encode({
				report: '/reports/observer/fuel/consumption',
				format: 'PDF',
				params: {
					reportid: record.getId()
				}
			})))
		);
	},

/**
	* Handles store loading
	* @protected
	*/
	onParentStoreLoad: function() {
		/*this.seriesStore = Ext.getStore('mon_waylist_series');
		this.store.each(function(record) {

		});*/
	}
});