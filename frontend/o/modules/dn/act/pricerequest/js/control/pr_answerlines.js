/**
 *
 * @class O.dn.act.pricerequest.Answer
 * @extends C.ui.Panel
 */
C.utils.inherit('O.dn.act.pricerequest.AnswerLines', {

/**
	* Component initialization
	*/
	initComponent: function() {

		this.callOverridden(arguments);

		this.grid = this.down('gridpanel');

		if (this.grid) {

			this.gridStore = this.grid.getStore();
		}
	},

/**
	* Загрузка данных
	*/
	load: function(record) {

		this.gridStore.removeAll();

		if (record == undefined) {

			this.disable();

		} else {

			if (this.gridStore.filters.items.length) {
				this.gridStore.clearFilter();
			}

			this.gridStore.filter([
				{property: "id_response", value: record.get('id_response')},
				{property: "id_place", value: record.get('id_place')}
			]);

			this.gridStore.getProxy().needReload = true;
			this.gridStore.loadPage(1);

			this.enable();
		}
	},

/**
	* Очистка данных
	*/
	clear: function() {
		this.gridStore.loadRecords([]);

		this.disable();
	}
});
