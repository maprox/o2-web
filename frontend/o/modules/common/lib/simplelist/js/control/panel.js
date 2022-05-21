/**
 * @class O.common.lib.SimpleList
 */
C.inherit('O.common.lib.SimpleList', {

/**
	* @constructor
	*/
	initComponent: function() {
		this.callOverridden(arguments);
		this.store = Ext.create('Ext.data.Store', {
			fields: [
				{name: 'note', type: 'string', defaultValue: ''},
				{name: this.prop, type: 'string'},
				{name: 'isprimary', type: 'int', defaultValue: false}
			],
			proxy: {
				type: 'memory'
			}
		});

		this.store.on({
			remove: 'onStoreRemove', // Remove record handler
			update: 'onStoreUpdate', // Update record handler
			scope: this
		});

		this.editor.on('canceledit', 'onCancelEdit', this);
		this.on('selectionchange', 'onSelectionChange', this);

		// button handlers
		if (this.btnAdd) {
			this.btnAdd.setHandler(this.addHandler, this);
		}
		if (this.btnRemove) {
			this.btnRemove.setHandler(this.removeHandler, this);
		}
		if (this.btnMakePrimary) {
			this.btnMakePrimary.setHandler(this.primaryHandler, this);
		}

	},

/**
	* Обработчик нажатия на кнопку "добавить"
	*/
	addHandler: function() {
		var store = this.getStore();
		store.insert(0, {});
		this.editor.startEdit(store.getAt(0), 0);
		this.newEntryDirty = true;
		this.fireEvent('changed', store);
	},

/**
	* Обработчик нажатия на кнопку "сделать основным"
	*/
	primaryHandler: function() {
		var selection = this.getSelectionModel().getSelection();
		if (selection.length != 1) {
			return;
		}

		// Get store
		var store = this.getStore();

		var isprimary = selection[0].get('isprimary');

		if (isprimary == 1) {
			selection[0].set('isprimary', 0);
			isprimary = 0;
		} else {
			// Disable pervious primary
			var prevPrimary =
				store.findExact('isprimary', 1);
			if (prevPrimary !== -1) {
				store.getAt(prevPrimary).set('isprimary', 0);
			}
			selection[0].set('isprimary', 1);
			isprimary = 1;
		}

		// Change button design
		this.changePrimaryBtn(isprimary);
	},

/**
	* Обработчик нажатия на кнопку "удалить"
	*/
	removeHandler: function() {
		var selected = this.getSelectionModel().getSelection();
		var store = this.getStore();

		store.remove(selected);
		this.fireEvent('changed', store);
	},

/**
	* Обработчик события смены выбора
	*/
	onSelectionChange: function(sm, selected) {
		// Get remove button
		var btn = this.down('#btnRemove');

		// Get make primary button
		var makePrimaryBtn = this.down('#btnMakePrimary');

		// Changing button design depending on isprimary property
		if (selected.length == 1) {
			var isprimary = selected[0].get('isprimary');
			this.changePrimaryBtn(isprimary);
		}

		// Enable or disable buttons
		if (this.getSelectionModel().getSelection().length) {
			btn.enable();
			makePrimaryBtn.enable();
		} else {
			btn.disable();
			makePrimaryBtn.disable();
		}
	},

/**
	* Обработчик отмены редактирования
	*/
	onCancelEdit: function() {
		if (!this.getStore().getAt(0) || !this.getStore().getAt(0).data[this.prop]) {
			this.getStore().removeAt(0);
		}
	},

/**
	* Обработчик удаления строки
	*/
	onStoreRemove: function(store, record) {
		if (record.get('address') != '') {
			this.dirty = true;
			this.fireEvent('dirtychange');
		} else {
			this.newEntryDirty = false;
		}
	},

/**
	* Обработчик обновления строки
	*/
	onStoreUpdate: function(store) {
		this.dirty = this.storeChanged(store);
		this.fireEvent('dirtychange');
	},

/**
	* Changes design of make primary button
	* @param {Boolean} isprimary Current isprimary state
	**/
	changePrimaryBtn: function(isprimary) {
		if (isprimary == 1) {
			this.down('#btnMakePrimary').setText(_('Undo primary'));
		} else {
			this.down('#btnMakePrimary').setText(_('Make primary'));
		}
	},

/**
	* Checks if store has entries with dirty is true
	* @param {Object} store Store
	*/
	storeChanged: function(store) {
		var changed = false;
		store.each(function(record) {
			if (record.dirty === true) {
				changed = true;
			}
		});

		return changed;
	},

/**
	* Resets condition, sets new data
	* @param {Object} data
	*/
	setData: function(data) {
		// Reset dirty flags for new entry
		this.newEntryDirty = false;
		this.dirty = false;
		this.fireEvent('dirtychange');

		// Clear store, load data
		this.getStore().removeAll();
		this.getStore().loadData(data);
	},

/**
	* Returns dirty flag
	* @return {Boolean}
	*/
	isDirty: function() {
		return this.dirty;
	},

/**
	* Returns new record dirty flag
	* @return {Boolean}
	*/
	isNewEntryDirty: function() {
		return this.newEntryDirty;
	},

/**
	* Returns store data
	* @return {Object}
	*/
	getData: function() {
		var data = [];
		this.getStore().each(function(record){
			data.push(record.data);
		});
		return data;
	}
});
