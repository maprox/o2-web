/**
 * @class O.common.lib.events.Panel
 */
C.utils.inherit('O.common.lib.events.Panel', {
/**
	* @constructs
	* @param {Object} config Объект конфигурации
	*/
	initComponent: function() {
		this.callOverridden(arguments);
		this.store = this.grid.getStore();
		this.relayEvents(this.grid, ['selectionchange']);
		C.bind('events', this);
	},

/**
	* New events reciever
	*/
	onUpdateEvents: function() {
		this.store.load();
	},

/**
	* Loads data for the period
	* @param {Date} sdt
	* @param {Date} edt
	*/
	load: function(sdt, edt) {
		this.store.getProxy().extraParams = {
			begin: C.utils.fmtDate(sdt),
			end: C.utils.fmtDate(edt)
		};
		this.store.loadPage(1);
	}
});
