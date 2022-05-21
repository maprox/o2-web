/**
 * @class O.mon.waylist.List
 */
C.utils.inherit('O.mon.waylist.List', {
/**
	* @constructor
	*/
	initComponent: function() {
		this.callOverridden(arguments);
		//
		if (this.actionToolbar) {
			this.btnPrint = Ext.widget('button', {
				itemId: 'btnPrint',
				text: _('Print'),
				iconCls: 'print'
			});
			this.actionToolbar.insert(2, this.btnPrint);
			this.btnPrint.setHandler(this.doPrintWaylist, this);
		}
		if (this.store) {
			this.store.on('load', this.onParentStoreLoad, this);
		}

		C.bind('mon_waylist', this);
	},

	/**
	 * Executes when waylist is updated
	 * @param {Object[]} data
	 * @private
	 */
	onUpdateMon_waylist: function(data) {
		Ext.each(data, function(item){
			var rec = this.store.data.getByKey(item.id);
			if (rec && rec.get('status') != item.status) {
				rec.set('status', item.status);
			}
		}, this);
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
	* User interface sync
	*/
	syncUi: function() {
		this.callOverridden(arguments);
		this.btnPrint.setDisabled(!this.isSelectedRecordPrintable());
		if (!this.btnRemove.isDisabled()) {

			this.btnRemove.setDisabled(
				this.getSelectedRecord().get('status') != Mon.Waylist.CREATED);
		}
	},

/**
	* Prints selected waylist
	*/
	doPrintWaylist: function() {
		if (!this.isSelectedRecordPrintable()) { return; }
		var record = this.getSelectedRecord();

		// Get waylist alias
		var alias = record.get('id_type$alias');

		window.open(Ext.String.format("/reports/export?data={0}",
			escape(Ext.encode({
				report: '/reports/observer/waylist/' + alias,
				format: 'PDF',
				params: {
					waylistid: record.getId()
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