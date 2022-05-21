/**
 * @class O.mon.lib.fuel.consumption.report.tab.Item
 */
C.utils.inherit('O.mon.lib.fuel.consumption.report.tab.Item', {
/**
	* @constructor
	*/
	initComponent: function() {
		this.callOverridden(arguments);
		this.on('recordload', 'onLoadRecord', this);
	},

/**
	* Record selection handler
	* @params {Ext.Component} cmp
	* @params {Ext.data.Model} record
	*/
	onLoadRecord: function(cmp, record) {
		if (!this.list) { return; }
		if (!this.list.editedRecord ||
			this.list.editedRecord.get('id_fuel_consumption_report')
			!== record.getId()
		) {
			this.list.loadByRecord(record);
		}
	}

});
