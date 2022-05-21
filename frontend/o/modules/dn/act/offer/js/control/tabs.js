/**
 * @class O.lib.prodsupply.offer.Tabs
 */
C.utils.inherit('O.lib.prodsupply.offer.Tabs', {

/**
	* @event have_data
	* Fires if loaded offer have associated values
	*/

/**
	* Selected offer
	* @type {Object}
	* @protected
	*/
	selected: null,

/**
	* @constructor
	*/
	initComponent: function() {
		this.callOverridden(arguments);

		this.on({
			changed: this.changed,
			select: this.valueSelect,
			scope: this
		});

		this.btnAddValues.setHandler(this.addValues, this);
		this.btnRemoveValue.setHandler(this.removeValue, this);
		this.btnSave.setHandler(this.saveChanges, this);
		this.btnReset.setHandler(this.resetChanges, this);
		this.btnGroupRegion.setHandler(this.groupRegion, this);
		this.btnGroupProduct.setHandler(this.groupProduct, this);
		this.btnGroupOff.setHandler(this.groupOff, this);

		this.editor.on({
			beforeedit: this.onBeforeEdit,
			afteredit: this.onAfterEdit,
			scope: this
		});

		this.offerEditorWindow.on({
			addvalues: this.onAddValues,
			scope: this
		});

		var userIsManager = C.userHasRight('admin_dn_offer');
		if (userIsManager) {
			this.btnAddValues.hide();
			this.btnRemoveValue.hide();
			this.btnSave.hide();
			this.btnReset.hide();
			/*this.btnGroupRegion.hide();
			this.btnGroupProduct.hide();
			this.btnGroupOff.hide();*/
		}

		//this.addEvents('saved');
		//this.addEvents('changed');
	},

/**
	* Активировать кнопки сохранения
	* @param {Boolean} notValid Присутствие ошибок в заполненной форме
	*/
	btnsEnable: function() {
		this.btnSave.enable();
		this.btnReset.enable();
		this.fireEvent('editstatechange', this, true);
	},

/**
	* Деактивировать кнопки сохранения
	*/
	btnsDisable: function() {
		this.btnSave.disable();
		this.btnReset.disable();
		this.fireEvent('editstatechange', this, false);
	},

/**
	* Проверка кнопок на активированность
	* @return {Boolean}
	*/
	btnsIsDisabled: function() {
		return this.btnSave.isDisabled();
	},

/**
	* Обработчик изменения данных пользователем
	*/
	changed: function() {
		// активация кнопок
		this.btnsEnable();
	},

/**
	* Загрузка пользователя в табпанель
	* @param {Object} record Объект пользователя
	*/
	loadTabs: function(record) {
		if (!record || !record.get('id')) {
			this.disable();
			return;
		}

		this.selected = record;
		// разблокировка панели
		this.enable();
		// деактивация кнопок
		this.btnsDisable();
		if (record.data.state == 2) {
			this.btnAddValues.enable();
			this.colAmount.show();
		} else {
			this.btnAddValues.disable();
			this.colAmount.hide();
		}
		this.setLoading(true);
		var filter = 'id_offer eq ' + record.get('id');
		filter += ' and id_warehouse > 0';
		C.get('dn_offer_value', function(data) {
			if (data.getCount() > 0) {
				this.fireEvent('have_data', record.get('id'));
			}
			this.getStore().loadData(data.getRange());
			this.setLoading(false);
			this.btnRemoveValue.disable();
		}, this, {'$filter': filter, '$joined': 1});
	},

/**
	* Обработчик нажатия кнопки сохранения
	*/
	saveChanges: function() {
		var me = this;
		var offerValues = this.getOfferValues();
		var ov = [];
		Ext.each(offerValues, function(item){
			ov.push({
				id_warehouse: item.get('id_warehouse') || 0,
				id_region: item.get('id_region') || 0,
				id_product: item.get('id_product'),
				price: item.get('price')
			});
		}, this);
		this.setLoading(true);

		Ext.Ajax.request({
			url: '/dn_offer_value/batch/',
			method: 'POST',
			params: {
				jsonData: Ext.JSON.encode({
					data: ov,
					id: this.selected.get('id')
				})
			},
			scope: this,
			success: function(response, opts) {
				//console.log(response);
				this.setLoading(false);
				if (response && response.responseText) {
					response = C.utils.getJSON(response.responseText, opts);

					if (response.success) {
						//successFunction.call(this, response);
						this.resetChanges();
					} else {
						failure.call(scope, response);
					}
				} else {
					failure.call(scope, response);
				}
			},
			failure: function(response) {
				if (response && response.responseText) {
					response = Ext.decode(response.responseText);
				}
				failure.call(scope, response);
			}
		});
	},

/**
	* Сохраняет по рядам, прерывает процесс когда все сохранено
	*/
	saveByRow: function(data)
	{
		if (data.length == 0) {
			O.msg.info(_('Offer saved successfully'));
			// деактивация кнопок
			me.btnsDisable();
			me.fireEvent('saved');
			this.setLoading(false);
			return;
		}

		var insert = data.shift();

		// отправка запроса на изменение данных
		O.manager.Model.add('dn_offer_value', insert, function(success) {
			this.saveByRow(ov);
		}, this, ['dn_offer_value']);
	},

/**
	* Обработчик нажатия кнопки сброса
	*/
	resetChanges: function() {
		this.loadTabs(this.selected);
	},


/**
	* Обработчи нажатия кнопки добавления значения
	*/
	addValues: function() {
		this.offerEditorWindow.show();
	},

/**
	* Adding offer values to the main panel
	* @param {Object[]} values An array of values
	*/
	onAddValues: function(values) {
		var data = [],
			existed = this.store.getRange();
		for (var i = 0, l = values.length; i < l; i++) {
			var valNew = values[i];
			var max = existed.length;
			if (!max) {
				data.push(valNew);
				continue;
			}
			for (var j = 0, m = max; j < m; j++) {
				var valPrev = existed[j].data;
				if ((valPrev.id_product == valNew.id_product)
					&& (!valNew.id_region
						|| (valPrev.id_region == valNew.id_region))
					&& (!valNew.id_warehouse
						|| (valPrev.id_warehouse == valNew.id_warehouse))
				) {
					break;
				}
				if (j + 1 == m) {
					data.push(valNew);
				}
			}
		}
		this.store.loadData(data, true);
		if (!Ext.isEmpty(values)) {
			this.fireEvent('changed');
		}
	},

/**
	* Обработчи нажатия кнопки удаления значения
	*/
	removeValue: function() {
		var selected = this.getSelectionModel().getSelection();
		this.store.remove(selected);
		this.btnRemoveValue.disable();
		this.fireEvent('changed');
	},

/**
	* Обработчик начала редактирования значения
	* Не дает редактировать, если предложение уже отправлено
	*/
	onBeforeEdit: function() {
		if (this.selected.data.state != 2) {
			return false;
		}
	},

/**
	* Обработчик завершения редактирования значения
	*/
	onAfterEdit: function() {
		this.fireEvent('changed');
	},

/**
	* Получение значений предложения
	* @return Object[]
	*/
	getOfferValues: function() {
		return this.store.getRange();
	},

/**
	* Обработчик выбора значения
	*/
	valueSelect: function() {
		if (this.selected.data.state == 2) {
			this.btnRemoveValue.enable();
		}
	},

/**
	* Обработчик клика по кнопке группировки по региону
	*/
	groupRegion: function(btn) {
		if (btn.pressed) {
			this.down('#colProduct').show();
			this.down('#colCode').show();
			this.down('#colRegion').hide();
			this.store.group('id_region$name');
		} else {
			btn.toggle();
		}
	},

/**
	* Обработчик клика по кнопке группировки по продукту
	*/
	groupProduct: function(btn) {
		if (btn.pressed) {
			this.down('#colRegion').show();
			this.down('#colProduct').hide();
			this.down('#colCode').hide();
			this.store.group('id_product$name');
		} else {
			btn.toggle();
		}
	},

/**
	* Обработчик клика по кнопке сброса группировки
	*/
	groupOff: function(btn) {
		if (btn.pressed) {
			this.down('#colRegion').show();
			this.down('#colProduct').show();
			this.down('#colCode').show();
			this.store.clearGrouping();
		} else {
			btn.toggle();
		}
	}
});
