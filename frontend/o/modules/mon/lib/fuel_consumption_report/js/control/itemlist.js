/**
 * @class O.mon.lib.fuel.consumption.report.ItemList
 */
C.utils.inherit('O.mon.lib.fuel.consumption.report.ItemList', {
/**
	* @constructor
	*/
	initComponent: function() {
		this.callOverridden(arguments);
		// let's disable "t.maxcountofmon_waylist_route" checking
		this._maxCountOfEntities = C.cfg.defaultMaxCountOfEntities;
		// init user interface (show edit button)
		this.btnOnOff.setVisible(false);
		this.btnEdit.setVisible(true);
		this.btnAdd.setVisible(false);
		this.btnRemove.setVisible(false);
	},

/**
	* Loads data for report
	* @params {Ext.data.Model} record
	*/
	loadByRecord: function(record) {
		this.reportRecord = record;
		this.gridStore.getProxy().extraParams = {
			'$filter': 'id_fuel_consumption_report eq ' + record.getId(),
			'$joined': 1
			//'$showtotalcount': 1
		};
		this.gridStore.load();
	},

/**
	* Start edit event
	*/
	beforeEdit: function() {
		if (this.reportRecord.get('status') == C.cfg.STATUS_CLOSED) {
			return false;
		}
		this.callParent(arguments);
	},

/**
	* User interface sync
	*/
	syncUi: function() {
		this.callParent(arguments);
		this.btnEdit.setDisabled(
			this.reportRecord
				&& this.reportRecord.get('status') == C.cfg.STATUS_CLOSED
		);
	}
});
