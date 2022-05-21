/**
 *
 * @class O.dn.act.pricerequest.List
 * @extends C.ui.Panel
 */
C.utils.inherit('O.dn.act.pricerequest.List', {

/**
	* @param {Object}
	* Stores information about which requests are empty
	*/
	requestsNonEmpty: {},

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
			'select',
			/**
			 * @event accept
			 * Fires when prices request is accepted
			 */
			'accept'
		);

		this.grid = this.down('gridpanel');

		if (this.grid) {

			this.grid.getSelectionModel().on({
				selectionchange: this.onGridSelectionChange,
				scope: this
			});

			this.gridEditor = this.grid.getPlugin('editor');

			this.gridStore = this.grid.getStore();
			this.gridStore.on({
				datachanged: this.onUpdate,
				write: this.onStoreWrite,
				scope: this
			});

		}
	},

/**
	* Создание строки
	*/
	actionCreate: function() {
		this.gridEditor.cancelEdit();
		// Create a record instance through the ModelManager
		var utcval = C.getSetting('p.utc_value');
		var now = new Date().pg_utc(utcval, true);
		var maxIndex = this.gridStore.max('num') || 0;
		this.gridStore.add({
			sdt: now,
			num: maxIndex + 1
		});
	},

/**
	* On store write
	*/
	onStoreWrite: function(store, o) {
		if (o.action !== 'create') {
			return;
		}
		// Select created record
		if (this.grid) {
			var sm = this.grid.getSelectionModel();
			sm.select(this.gridStore.last());
			this.fireEvent('tendercreate');
		}
	},

/**
	* Удаление строки
	*/
	actionDelete: function() {
		var rec = this.getSelectedRecord();
		if (!rec) { return; }
		O.msg.confirm({
			msg: this.msgAskDelete,
			fn: function(buttonId) {
				if (buttonId != 'yes') { return; }
				this.gridEditor.cancelEdit();
				this.gridStore.remove(rec);
			},
			scope: this
		});
	},

/**
	* Одобрение запроса
	*/
	actionAccept: function() {
		var rec = this.getSelectedRecord();
		if (!rec) { return; }

		var edt = rec.get('edt');

		if (Ext.isEmpty(edt)) {
			O.msg.info(this.msgAlertNoDate);
			return;
		}

		var utcval = C.getSetting('p.utc_value');
		var now = new Date().pg_utc(utcval, true);
		if (edt < now) {
			O.msg.info(this.msgAlertOldDate);
			return;
		}

		O.msg.confirm({
			msg: this.msgAskAccept,
			fn: function(buttonId) {
				if (buttonId != 'yes') { return; }
				this.gridEditor.cancelEdit();
				rec.set('status', 2);
				this.fireEvent('accept', rec);
				this.checkButtons();
			},
			scope: this
		});
	},

	onUpdate: function() {
		var record = this.getSelectedRecord();
		this.acceptAction.disable();
		if (record != null) {
			if (record.get('status') < 2) {
				this.acceptAction.enable();
			};
		}
	},

/**
	* Обработчик смены текущей строки грида
	*/
	onGridSelectionChange: function() {
		this.gridEditor.cancelEdit();
		var record = this.getSelectedRecord();
		this.checkButtons();
		this.fireEvent('select', record);
	},

/**
	* Включает/выключает кнопки отправки и удаления
	*/
	checkButtons: function() {
		var record = this.getSelectedRecord();
		this.acceptAction.disable();
		this.deleteAction.disable();
		if (record != null && record.get('status') < 2) {
			this.deleteAction.enable();

			if (this.requestsNonEmpty[record.get('id')]) {
				this.acceptAction.enable();
			}
		}
	},

/**
	* Пришла информация о пустом/непустом запросе, сохраняем
	*/
	markNonEmpty: function(nonEmpty, id) {
		this.requestsNonEmpty[id] = nonEmpty;

		this.checkButtons();
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
