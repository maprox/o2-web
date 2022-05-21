/**
 * @class O.mon.lib.waylist.tab.History
 */
C.utils.inherit('O.mon.lib.waylist.tab.History', {
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
		var idWaylist = this.getSelectedRecord().get('id');

		if (!idWaylist || idWaylist == 0) {
			this.disable();
		} else {
			this.enable();
			this.gridStore.getProxy().url =
				'/x_history/mon_waylist/' + idWaylist;

			this.down('pagingtoolbar').moveFirst();
		}
	}
});
