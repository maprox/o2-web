/**
 *
 * @class O.dn.act.pricerequest.Answer
 * @extends C.ui.Panel
 */
C.utils.inherit('O.dn.act.pricerequest.AnswerList', {

/**
	* Component initialization
	*/
	initComponent: function() {
		this.callOverridden(arguments);

		this.addEvents(
			/**
			 * @event select
			 * Fires when prices request is selected
			 */
			'select'
		);

		this.grid = this.down('gridpanel');

		if (this.grid) {

			this.grid.getSelectionModel().on({
				selectionchange: 'onGridSelectionChange',
				scope: this
			});

			this.gridStore = this.grid.getStore();
		}

		this.supplierStore = Ext.data.StoreManager.lookup('storeSupplierAccount');
		this.supplierStore.load();
		if (this.supplierStore) {
			this.supplierStore.on('load', this.hideDisabled, this);
		}
	},

/**
	* Загрузка данных
	*/
	load: function(id) {

		this.gridStore.removeAll();

		//if (this.gridStore.filters.items.length) {
			this.gridStore.clearFilter();
		//}

		this.gridStore.filter("id_request", id);
		this.gridStore.loadPage(1);

		this.enable();
		this.hideDisabled();
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
	},

/**
	* Hides answers from disabled suppliers
	*/
	hideDisabled: function(hide) {
		this.gridStore.clearFilter();
		if (!hide) { return; }
		var me = this;
		this.gridStore.filter([{
			filterFn: function(item) {
				var supplierIndex = me.supplierStore.find(
					'id_firm_client',
					item.get('id_firm')
				);
				var supplier = me.supplierStore.getAt(supplierIndex);
				if (supplier) {
					return (supplier.get('state') !==
						C.cfg.RECORD_IS_DISABLED);
				}
				return true;
			}
		}]);
	}
});
