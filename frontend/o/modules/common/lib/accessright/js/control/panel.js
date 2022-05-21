/**
 * Access right editor panel control
 * @class O.accessright.Panel
 * @extends C.ui.Panel
 */

C.utils.inherit('O.accessright.Panel', {

/**
	 * Срабатывает при редактировании записи. Если запись имела айдишник - синхронизируем.
	 * В противном случае создадим, и запишем айдишник.
	 * @param {Ext.data.Store} store
	 * @param {Ext.data.model} record
	 */
	storeUpdate: function(store, record, operation, modifiedFieldNames) {
		if (Ext.isEmpty(modifiedFieldNames)) {
			return;
		}
		var data = this.transformData(record);

		if (!data.id) {
			this.setLoading(true);

			O.manager.Model.add('x_right', data, function(success, response) {
				record.set('id', response.data.id);
				record.commit();
				this.setLoading(false);
			}, this);
		} else {
			 O.manager.Model.set('x_right', data, function(response) {
				 record.commit();
			 }, this);
		}
	},

/**
	 * Срабатывает при удалении записи. Если запись имела айдишник - удалим с сервера.
	 * @param {Ext.data.Store} store
	 * @param {Ext.data.model} record
	 */
	storeRemove: function(store, record) {
		if (!record.get('id')) {
			return;
		}

		O.manager.Model.remove('x_right', {id: record.get('id')});
	},

/**
	 * Превращает запись местного store в модель данных x_right
	 * @param {Ext.data.model} record
	 * @return {Object}
	 */
	transformData: function(record) {
		var data = {
			id: record.get('id'),
			name: record.get('name'),
			description: record.get('description'),
			alias: record.get('alias'),
			type: record.get('read') * 1 + record.get('write') * 2 +
				record.get('create') * 4,
			service: 0
		}

		for (var i = 0; i < this.serviceNumber; i++) {
			data.service += record.get('service' + (i + 1)) * Math.pow(2, i);
		}

		return data;
	},

/**
	 * Обработчик нажатия на кнопку "создать"
	 * Создает пустую запись, вызывает ее редактирование
	 */
	actionCreate: function() {
		this.localStore.insert(0, {});
		this.editor.startEdit(this.localStore.first(), this.grid.columns[0]);
		this.checkSelectionEdit();
	},

/**
	 * Обработчик нажатия на кнопку "удалить"
	 * Останавливает редактирование, удаляет запись
	 */
	actionDelete: function() {
		var sm = this.grid.getSelectionModel();
		if (sm.hasSelection()) {
			var record = sm.getSelection()[0];

			this.editor.cancelEdit();
			this.localStore.remove(record);
			this.checkSelection();
		}
	},

/**
	 * Обработчик нажатия на кнопку "редактировать"
	 * Вызывает редактор на выбранную запись
	 */
	actionEdit: function() {
		var sm = this.grid.getSelectionModel();
		if (sm.hasSelection()) {
			var record = sm.getSelection()[0];

			this.editor.cancelEdit();
			this.editor.startEdit(record, 0);
			this.checkSelectionEdit();
		}
	},

/**
	 * Проверяет, выбрана ли запись и делает активными соответствующие кнокпи
	 */
	checkSelection: function() {
		var sm = this.grid.getSelectionModel();
		if (sm.hasSelection()) {
			this.buttonEdit.enable();
			this.buttonDelete.enable();
		} else {
			this.buttonEdit.disable();
			this.buttonDelete.disable();
		}

		this.buttonCreate.enable();
	},

/**
	 * Отмечает кнопки активные при редактировании
	 */
	checkSelectionEdit: function() {
		this.buttonDelete.enable();
		this.buttonEdit.disable();
		this.buttonCreate.disable();
	},

/**
	 * При отмене редактирования удаляет запись, если она новая.
	 */
	removeIfNew: function() {
		var sm = this.grid.getSelectionModel();
		if (sm.hasSelection) {
			var record = sm.getSelection()[0];
			if (record && !record.get('id')) {
				this.localStore.remove(record);
				this.checkSelection();
			}
		}
	}
});
