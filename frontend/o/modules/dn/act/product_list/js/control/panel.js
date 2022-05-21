/**
 *
 * @class O.act.panel.ProductList
 */
C.utils.inherit('O.act.panel.ProductList', {
/**
	* @constructs
	*/
	initComponent: function() {

		this.callOverridden(arguments);

		this.grid = this.down("gridpanel");
		this.gridStore = this.grid.getStore();
		this.editor = this.grid.getPlugin('editor');

		this.grid.on({
			select: this.onSelect,
			scope: this
		});

		this.gridStore.on({
			add: this.launchEditor,
			scope: this
		});

		this.editor.on({
			beforeedit: this.validateEdit,
			edit: this.saveEdit,
			canceledit: this.cancelEdit,
			scope: this
		})

		this.grid.on('gridrefresh', this.onGridRefresh, this);
	},

	validateEdit: function(data) {
		if (this.noValidate) {
			return true;
		}

		var record = this.getSelectedRecord();
		if (!record) { return false; }
		return true;// !record.get('used');
	},

	launchEditor: function(store, records) {
		this.noValidate = true;
		this.editor.startEdit(records[0], this.grid.columns[0]);
		this.noValidate = false;
	},

	saveEdit: function() {
		this.gridStore.sync();
		// TODO: this is hack
		this.onGridRefresh();
	},

	cancelEdit: function() {
		this.gridStore.sync();
		this.removeIfNew();
	},

/**
	 * При отмене редактирования удаляет запись, если она новая.
	 */
	removeIfNew: function() {
		var sm = this.grid.getSelectionModel();
		if (sm.hasSelection) {
			var record = sm.getSelection()[0];
			if (record && !record.get('id')) {
				this.gridStore.remove(record);
				this.onSelect();
			}
		}
	},

/**
	* Обработчик смены текущей строки грида
	*/
	onSelect: function(sm, selections) {
		var record = this.getSelectedRecord();

		this.cloneAction.disable();
		this.deleteAction.disable();

		if (record != null) {
			this.cloneAction.enable();

			if (!record.get('used')) {
				this.deleteAction.enable();
			}
		}
	},

/**
	 * On grid refresh button pressed
	 * TODO: this is hack
	 */
	onGridRefresh: function() {
		var me = this;
		this.setLoading(true);

		var s = Ext.data.StoreManager.lookup('productRemote');
		s.load({
			scope: this,
			callback: function(records, operation, success) {
				me.grid.store.load();
				this.setLoading(false);
			}
		});
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

	actionCreate: function() {
		var record = Ext.create('Product');

		this.gridStore.insert(0, record);
	},

	actionClone: function() {
		var record = this.getSelectedRecord(),
			newRecord = Ext.create('Product');

		this.editor.cancelEdit();

		newRecord.set('name', record.get('name'));
		newRecord.set('fullname', record.get('fullname'));
		newRecord.set('id_measure', record.get('id_measure'));
		newRecord.set('code', record.get('code'));
		newRecord.set('ntd', record.get('ntd'));
		newRecord.set('shipmenttime', record.get('shipmenttime'));
		newRecord.set('shelflife', record.get('shelflife'));
		newRecord.set('used', false);

		this.gridStore.insert(0, newRecord);
	},

	actionDelete: function() {
		var record = this.getSelectedRecord();
		if (!record) { return; }

		Ext.MessageBox.confirm(
			this.msgConfirmation,
			this.msgAskDelete,
			function(buttonId) {
				if (buttonId != 'yes') { return; }
				this.editor.cancelEdit();
				this.gridStore.remove(record);
				this.gridStore.sync();
			},
			this
		);
	}
});
