/**
 * @class O.mon.act.condition.Grid
 * @extends Ext.grid.Panel
 */
C.utils.inherit('O.mon.act.condition.Grid', {

	/**
	 * Component initialization
	 */
	initComponent: function() {
		this.callParent(arguments);
		C.bind('clock10', this);
	},

	/**
	 * Обновляемся раз в 10 секунд, перерисовываем статус
	 */
	onUpdateClock10: function() {
		if (this.hasData) {
			this.store.suspendEvents();
			var me = this;
			this.store.load(function(){
				me.getView().refresh();
				me.store.resumeEvents();
			});
		}
	},

	/**
	 * Limits selection to given ids
	 * @param {number[]} ids
	 */
	setIds: function(ids) {
		if (!ids.length) {
			ids = [0];
			this.hasData = false;
		} else {
			this.hasData = true;
		}

		this.store.getProxy().extraParams['$filter'] =
			'id in (' + ids.join(', ') + ')' +
			' and state eq ' + C.cfg.RECORD_IS_ENABLED;

		this.store.loadPage(1);
	}
});