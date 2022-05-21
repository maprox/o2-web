/**
 *
 * @class O.dn.act.priceresponse.EditorList
 * @extends C.ui.Panel
 */
C.utils.inherit('O.dn.act.priceresponse.EditorList', {

/**
	* Component initialization
	*/
	initComponent: function() {

		this.callOverridden(arguments);

		this.addEvents(
			/**
			 * @event select
			 * Fires when payment response is selected
			 */
			'select'
		);

		this.grid = this.down('gridpanel');
		if (this.grid) {

			this.gridStore = this.grid.getStore();

			this.grid.getSelectionModel().on({
				selectionchange: this.onGridSelectionChange,
				scope: this
			});
		}
	},

/**
	* Загрузка данных
	*/
	load: function(record) {

		var idRequest = record.get('id_request');
		var idResponse = record.get('id');

		this.gridStore.removeAll();

		if (this.gridStore.filters.items.length) {
			this.gridStore.clearFilter();
		}

		this.gridStore.filter([
			{property: "id_request", value: idRequest},
			{property: "id_response", value: idResponse}
		]);

		this.gridStore.getProxy().needReload = true;
		this.gridStore.loadPage(1);

		this.enable();
	},

/**
	* Очистка данных
	*/
	clear: function() {
		this.gridStore.loadRecords([]);
		this.disable();
	},

/**
	* Обработчик смены текущей строки грида
	*/
	onGridSelectionChange: function(sm, selections) {
		var record = this.getSelectedRecord();

		this.fireEvent('select', record);
	},

/**
	* Возвращает текущую выбранную запись в гриде
	* @return {Object Ext.data.Model}
	*/
	getSelectedRecord: function() {
		var record = null;
		var sm = this.grid.getSelectionModel();
		if (sm.hasSelection) {
			record = sm.getSelection()[0];
		}
		return record;
	}

});
