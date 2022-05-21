/**
 * @class O.act.dn.offer.Panel
 */
C.utils.inherit('O.act.dn.offer.Panel', {

/**
	* @constructor
	*/
	initComponent: function() {
		var me = this;
		this.callOverridden(arguments);
		this.list.on({
			select: this.onListSelect,
			loaded: this.onListLoaded,
			removed: this.onListRemoved,
			scope: this
		});

		this.tabs.on({
			saved: this.onTabsSaved,
			editstatechange: this.onTabsEditStateChange,
			have_data: this.onTabsHaveData,
			scope: this
		});
	},

/**
	* Fires when edit state of offer is changed
	* @param {O.lib.prodsupply.offer.Tabs} cmp
	* @param {Boolean} changed True if there is changes
	* @private
	*/
	onTabsEditStateChange: function(cmp, changed) {
		this.list.changed(changed);
	},

/**
	* Fires when loaded record have values
	* @param {Number} id Id of loaded record
	* @private
	*/
	onTabsHaveData: function(id) {
		this.list.recordHaveData(id);
	},

/**
	* Обработчик сохранения записи
	*/
	onTabsSaved: function() {
		// перезагружаем список устройств
		this.list.loadOffers();
	},

/**
	* Обработчик выбора записи
	*/
	onListSelect: function() {
		var me = this;
		// определяем выбранную запись
		var selected = this.list.getSelected();
		// если активны кнопки сохранения (были изменения)...
		if (!this.tabs.btnsIsDisabled()) {
			// ...то спрашиваем, сохранить ли?
			Ext.MessageBox.show({
				title: this.lngSaveChangesTitle,
				msg: this.lngSaveChangesText,
				buttons: Ext.MessageBox.YESNO,
				closeable: false,
				fn: function(choice) {
					switch (choice) {
						case 'yes':
							// сохраняем
							me.tabs.saveChanges();
							// break тут не нужен!
						case 'no':
							// деактивируем кнопки сохранения
							me.tabs.btnsDisable();
							// "выбираем" еще раз
							me.tabs.loadTabs(selected);
							break;
					}
				}
			});
		} else {
			// загружаем запись в табы
			this.tabs.loadTabs(selected);
		}
	},

/**
	* Обработчик загрузки списка
	*/
	onListLoaded: function() {
		// если ранее была выбрана запись...
		if (this.tabs.selected) {
			// ...то выбираем ее по ID
			// (т.к. порядок мог измениться)
			var selectedId = this.tabs.selected.getId();
			this.list.selectById(selectedId);
		}
	},

/**
	* Обработчик удаления записи
	*/
	onListRemoved: function() {
		// сбрасываем выбранную запись
		this.tabs.selected = null;
		// блокируем вкладки
		this.tabs.disable();
		// блокируем кнопки редактирования
		this.list.btnsDisable();
		this.tabs.btnsDisable();
	},

/**
	* Activating module panel
	* @param {Object[]} params An array of module params {name: '', value: ''}
	*/
	moduleActivate: function(params) {
		this.callParent(arguments);
		if (params && params.length) {
			var param = params[0];
			if (param.name == 'id' && param.value > 0) {
				this.list.selectById(param.value);
			} else if (param.name == 'new') {
				this.list.addRecord();
			}
		}
	}
});
