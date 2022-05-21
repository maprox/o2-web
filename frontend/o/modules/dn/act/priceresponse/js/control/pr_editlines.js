/**
 *
 * @class O.dn.act.priceresponse.EditorLines
 * @extends C.ui.Panel
 */
C.utils.inherit('O.dn.act.priceresponse.EditorLines', {

/**
	* Component initialization
	*/
	initComponent: function() {

		this.callOverridden(arguments);

		this.addEvents(
			/**
			 * @modified
			 * Fires on any edit
			 */
			'modified'
		);

		this.grid = this.down('gridpanel');
		if (this.grid) {

			this.gridEditor = this.grid.getPlugin('editor');
			this.gridStore = this.grid.getStore();

			this.gridStore.on({
				write: this.onUpdate,
				scope: this
			});
		}
	},

/**
	* Загрузка данных
	*/
	load: function(record) {

		var idRequest = record.get('id_request');
		var idPlace = record.get('id_place');

		this.gridStore.removeAll();
		if (this.gridStore.filters.items.length) {
			this.gridStore.clearFilter();
		}

		this.gridStore.filter([
			{property: "id_request", value: idRequest},
			{property: "id_place", value: idPlace}
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

	onUpdate: function(adsf) {
		var record = this.gridStore.first();

		if (record) {
			this.fireEvent('modified', record.get('id_request'));
		}
	},

	disableEditor: function() {

		this.toggleEditor(false);
	},

	enableEditor: function() {

		this.toggleEditor(true);
	},

	toggleEditor: function(editorEnabled) {

		this.gridEditor.beforeEdit = function (){
			return editorEnabled;
		}
	}

});
