/**
 *
 * @class O.dn.act.pricerequest.Editor
 * @extends C.ui.Panel
 */
C.utils.inherit('O.dn.act.pricerequest.EditorList', {

/**
	* Component initialization
	*/
	initComponent: function() {
		this.callOverridden(arguments);

		this.addEvents(
			/**
			 * @event select
			 * Fires when warehouse is selected
			 */
			'select',
			/**
			 * @event list_loaded
			 * Fires when list finishes loading
			 */
			'list_loaded'
		);

		this.grid = this.down('gridpanel');

		if (this.grid) {

			this.grid.getSelectionModel().on({
				selectionchange: this.onGridSelectionChange,
				scope: this
			});

			this.gridStore = this.grid.getStore();

			this.gridStore.on({
				load: this.onChanged,
				scope: this
			});
		}

		if (this.emptyButton) {
			this.emptyButton.on('toggle', this.toggleEmpty, this);
		}
	},

/**
	* Toggle displaying of empty records
	*/
	toggleEmpty: function() {
		var button = this.emptyButton;
		this.gridStore.clearFilter();
		if (!button.pressed) {
			this.gridStore.filterBy(function(record) {
				return record.get("amount") > 0;
			});
		}
		this.gridStore.sort({
			property: 'name',
			direction: 'ASC'
		});
	},

/**
	* Загрузка данных
	*/
	load: function(id) {

		this.gridStore.removeAll();

		if (this.gridStore.filters.items.length) {
			this.gridStore.clearFilter();
		}

		this.gridStore.filter("id_request", id);
		this.gridStore.loadPage(1);

		//this.emptyButton.toggle(true, true);
	},

/**
	* После загрузки данных, проверим есть ли непустые склады и оповестим лист
	*/
	onChanged: function() {
		var haveAmount = false,
			requestId = false;

		// Apply empty filter
		this.toggleEmpty();

		this.gridStore.each(function(record) {
			if (!requestId) {
				requestId = record.get('id_request');
			}

			if (record.get('amount')) {
				haveAmount = true;
				return false;
			}
		});

		if (requestId) {
			this.fireEvent('list_loaded', {haveAmount: haveAmount,
				requestId: requestId});
		}
	},

/**
	* От списка пришло сообщение о смене количества.
	*/
	onAmountChange: function(requestId, placeId, haveAmount) {
		var index = this.gridStore.findBy(function(record) {
			return record.get('id_request') == requestId &&
				record.get('id') == placeId;
		});

		this.gridStore.getAt(index).set('amount', haveAmount + 0);
		this.onChanged();
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
	},

	clearSelection: function() {
		var sm = this.grid.getSelectionModel();

		sm.deselectAll(true);
	}

});
