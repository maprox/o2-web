/**
 * @class O.lib.billing.List
 */
C.utils.inherit('O.lib.billing.List', {

/**
	* @construct
	*/
	initComponent: function() {
		this.callOverridden(arguments);
		this.store.clearFilter();
		this.down('#btnOnOff').hide();
		if (!C.userHasRight('admin_billing_account') || !this.firms) {
			this.down('#btnAdd').hide();
			this.down('#btnRemove').hide();
			//this.down('toolbar').hide();
		}
		this.editor.on('beforeedit', function() {
			return false;
		}, this);
	},

/**
	* Загрузка записи в хранилище
	* @param {Number} selectedId Identifier of object to select
	* @return {false}
	*/
	loadModels: function(selectedId) {
		var me = this;
		this.store.loadData([]);
		//this.parent.setLoading(true);
		var params = (this.firmId > 0) ? {$firm: this.firmId} : null;
		C.get(this.managerAlias, function(models, success) {
			if (!success) { return; }
			//Ext.Array.each(models.);
			me.models = models;
			me.store.loadData(models.getRange());
			if (me.store.getCount() == 0) {
				me.btnOnOff.disable();
			}
			// max count of objects
			var maxCount = parseInt(C.getSetting('t.maxcountof' +
				me.managerAlias));
			// check max count
			if (!maxCount || me.store.getCount() < maxCount) {
				me.btnAddEnable();
			} else {
				me.btnAddDisable();
			}
			// Поскольку пока аккаунт у нас может быть только один,
			// выберем автоматом его. Впоследствие эту строчку убрать,
			// и раскомментировать строчки ниже.
			//me.selectFirst();
			//if (selectedId > 0) {
			//	me.selectById(selectedId);
			//}
			//
			// fire event
			me.fireEvent('loaded');
		}, this, params);
		return false;
	},

/**
	* Обработка события редактирования имени записи
	*/
	afterEdit: function(e) {
		// картинка загрузки
		this.setLoading(true);
		// получаем данные редактируемой записи
		var data = this.store.getAt(e.rowIdx).data;
		// если запись новая...
		if (data.id == 0) {
			// ...то передаем все поля
			O.manager.Model.add(this.managerAlias, data,
				function(success, opts) {
					if (success) {
						// уведомление, что все будет хорошо
						O.msg.info(this.lngAddedText);
						// перезагружаем список устройств
						this.loadModels(opts.data[0].id);
					}
					// выключаем картинку загрузки
					this.setLoading(false);
				}, this);
		// если запись не новая...
		} else {
			// ...то нет необходимости передавать остальные поля
			data = {
				id: data.id,
				name: data.name
			}
			// запрос на переименование
			O.manager.Model.set(this.managerAlias, data, function(success) {
				if (success) {
					// уведомление, что все будет хорошо
					O.msg.info(this.lngRenamedText);
					// перезагружаем список устройств
					this.loadModels(data.id);
				}
				// выключаем картинку загрузки
				this.setLoading(false);
			}, this);
		}
	},

/**
	* Обработчик нажатия на кнопку добавления
	*/
	addRecord: function() {
		var me = this;
		var data = {id_firm: this.firmId};
		O.manager.Model.add('billing_account', data, function(success, opts) {
			if (success) {
				O.msg.info(this.lngAddedText);
				this.loadModels(opts.data[0].id);
			}
			me.setLoading(false);
		}, this);
	}
});
