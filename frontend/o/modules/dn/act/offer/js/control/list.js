/**
 * @class O.lib.prodsupply.offer.List
 */
C.utils.inherit('O.lib.prodsupply.offer.List', {

/**
	* @constructor
	*/
	initComponent: function() {
		this.callOverridden(arguments);

		this.btnAdd.setHandler(this.addRecord, this);
		this.btnCopy.setHandler(this.copyRecord, this);
		this.btnSend.setHandler(this.send, this);
		this.btnRemove.setHandler(this.removeRecord, this);

		this.on({
			select: this.onSelect,
			scope: this
		});

		var userIsManager = C.userHasRight('admin_dn_offer');
		if (userIsManager) {
			this.btnAdd.hide();
			this.btnCopy.hide();
			this.btnSend.hide();
			this.btnRemove.hide();
		}

		if (this.getStore().getCount()) {
			this.btnAdd.hide();
			if (!userIsManager) {
				this.btnCopy.show();
			}
		} else {
			if (!userIsManager) {
				this.btnAdd.show();
			}
			this.btnCopy.hide();
		}
	},

/**
	* Обработчик выбора записи
	* @param {Object} cmp Компонент
	* @param {Object} record Выбранная запись
	*/
	onSelect: function(cmp, record) {
		this.selected = record;
		if (!record.data) {
			return;
		}

		// Find last sended offer
		var last = null;
		var newLast = null;
		var lastIndex = null;
		this.store.each(function(r) {
			if (r.get('edt')) {
				newLast = new Date().pg_fmt(r.get('edt'))
					.pg_utc(C.getSetting('p.utc_value'));

				if (last == null || newLast >= last) {
					last = newLast;
					lastIndex = r.index;
				}
			}
		});

		var method = 'disable';
		if (record.data.state == 2 ||record.index != lastIndex) {
			method = 'enable';
		}

		this.btnSend.disable();
		this.btnRemove[method]();
		this.btnCopy.enable();
	},

/**
	* Обработчик изменения состояния редактирования записи
	* @param {Boolean} changed Запись редактирована
	*/
	changed: function(changed) {
		if (this.selected) {
			this.onSelect(null, this.selected);
		}
		if (changed) {
			this.btnSend.disable();
		}
	},

/**
	* Включает отправку записи, если она не пуста
	* @param {Number} id Айди записи
	*/
	recordHaveData: function(id) {
		if (this.selected &&
			this.selected.get('state') == 2 &&
			this.selected.get('id') == id) {

			this.btnSend.enable();
		}
	},

/**
	* Загрузка в хранилище
	* @return {false}
	*/
	loadOffers: function(selectId) {
		var me = this;
		this.setLoading(true);
		// получаем записи от менеджера
		C.get('dn_offer', function(offers) {
			var data = [];
			offers.each(function(o) {
				data.push(o);
			});
			me.store.loadData(data);
			if (selectId > 0) {
				me.selectById(selectId);
			}
			if (data.length) {
				me.btnAdd.hide();
				me.btnCopy.show();
			} else {
				me.btnAdd.show();
				me.btnCopy.hide();
			}
			me.setLoading(false);
			this.fireEvent('loaded');
		}, this);
		return false;
	},

/**
	* Выбор записи по идентификатору
	* @param {Intager} id ID записи
	*/
	selectById: function(id) {
		// все записи
		var records = this.store.getRange();
		// обход записей
		var len = records.length;
		for (var i = 0; i < len; i++) {
			if (records[i].getId() == id) {
				this.getSelectionModel().select(i);
				break;
			}
		}
	},

/**
	* Обработка события добавления записи
	*/
	addRecord: function() {
		this.createRecord();
	},

/**
	* Обработка нажатия на кнопку копирования записи
	*/
	copyRecord: function() {
		this.createRecord(this.selected.get('id'));
	},

/**
	* Создание записи
	*/
	createRecord: function(id) {
		var me = this;
		data = {};
		if (id) {
			data['copyid'] = id;
		}
		this.setLoading(true);
		O.manager.Model.add('dn_offer', data, function(success, opts) {
			if (success) {
				O.msg.info(me.lngAddedText);
				var offerId = opts.data || null;
				me.loadOffers(offerId);
			}
			me.setLoading(false);
		}, this);
	},

/**
	* Обработчик нажатия на кнопку удаления записи
	*/
	removeRecord: function() {
		var me = this;
		// request user confirmation
		O.msg.confirm({
			msg: this.lngRemoveConfirmText,
			fn: function(choice) {
				if (choice !== 'yes') { return; }
				// определяем выбранную запись
				var selected = me.getSelected();
				if (!selected || !selected.getId()) {
					return;
				}
				var data = {
					id: selected.getId()
				};
				// картинка загрузки
				me.setLoading(true);
				// удаляем
				O.manager.Model.remove('dn_offer', data, function(success) {
					if (success) {
						me.selected = null;
						// уведомляем об удалении
						me.fireEvent('removed');
						// перезагружаем список
						me.loadOffers();
						// display message
						O.msg.info(me.lngRemovedText);
					}
					// выключаем картинку загрузки
					me.setLoading(false);
				}, this);
			}
		});
	},

/**
	* Обработчик нажатия на кнопку отправления
	*/
	send: function() {
		var me = this;
		// request user confirmation
		O.msg.confirm({
			msg: this.lngSendConfirmText,
			fn: function(choice) {
				if (choice !== 'yes') { return; }
				// определяем выбранную запись
				var selected = me.getSelected();
				if (!selected || !selected.getId()) {
					return;
				}
				// картинка загрузки
				me.setLoading(true);

				var data = {
					id: selected.getId(),
					edt: 'now()',
					state: 1
				};

				C.get('dn_account', function(accounts){
					accounts.each(function(account) {
						data['$accessGrant'] = Ext.JSON.encode(
							[{id_firm: account.id_firm}]);
						return false;
					});
				});

				// отправляем
				O.manager.Model.set('dn_offer', data, function(success) {
					if (success) {
						// перезагружаем список
						me.loadOffers(selected.getId());
						// display message
						O.msg.info(me.lngSendedText);
					}
					// выключаем картинку загрузки
					me.setLoading(false);
				}, this);
			}
		});
	},

/**
	* Получение выбранных записей
	* @return Object
	*/
	getSelected: function() {
		var selection = this.getSelectionModel().getSelection();
		return selection.length ? selection[0] : null;
	},

/**
	* Деактивация кнопок удаления и отправки
	*/
	btnsDisable: function() {
		this.btnSend.disable();
		this.btnRemove.disable();
	}
});
