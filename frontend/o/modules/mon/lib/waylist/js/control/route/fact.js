/**
 * @class O.mon.lib.waylist.RouteFact
 */
C.utils.inherit('O.mon.lib.waylist.RouteFact', {


	/**
	 * @constructs
	 */
	initComponent: function() {
		this.callOverridden(arguments);
		this.grid.on('select', this.onGridSelect, this);
	},

/**
	* Loads data for waylist
	* @params {Ext.data.Model[]} records
	*/
	setData: function(records) {
		this.gridStore.loadData(records);
	},

	/**
	 * Grid selection handler
	 */
	onGridSelect: function(selection, record) {
		this.fireEvent('route_selected', record);
	}
});
