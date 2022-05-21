/**
 *
 * @class O.lib.ObjectAccessList
 * @extends C.ui.Panel
 */
C.utils.inherit('O.lib.ObjectAccessList', {

/**
	* Cache for access rights
	*/
	accessCache: new Ext.util.MixedCollection(),

/**
	* Component initialization
	*/
	initComponent: function() {
		this.callOverridden(arguments);
		this.objectId = 0;
		this.on('afterrender', this.onAfterRender, this);
		this.addEvents('dataChanged');
		//запретить генерацию событий на время загрузки
		this.disableEvents = false;
	},

/**
	 * Инициализация событий компонента
	 */
	onAfterRender: function() {
		this.setInternalControls();
		this.rAccessDenied.on('change', this.onAccTypeChange, this);
		this.rAccessSelected.on('change', this.onAccTypeChange, this);
		this.rAccessAll.on('change', this.onAccTypeChange, this);
		this.accessList.down('#btnRemoveAccess').setHandler(this.removeFirm, this);
		this.accessList.down('#btnGrantAccess').setHandler(this.addFirm, this);
		this.accessList.on('selectionchange', this.userSelected, this);
		this.down('#btnSave').setHandler(this.save, this);
		this.down('#btnReset').setHandler(this.reset, this);
		this.disableReset();
	},

/**
	 * Создание окна для поиска пользователей
	 */
	createSearchWindow: function() {
		this.searchWindow = Ext.create('O.lib.FirmSearch');
		this.searchWindow.on('firmAdded', this.firmAdded, this);
	},

/**
	 * Пользователь добавлен
	 */
	firmAdded: function(firm) {
		this.firmsStore.add(firm);
		this.enableReset();
		this.searchWindow.hide();
	},

/**
	 * Запрещение кнопки сброс
	 */
	disableReset: function() {
		this.down('#btnReset').disable();
		this.down('#btnSave').disable();
	},

/**
	 * Разрешение кнопки сброс
	 */
	enableReset: function() {
		this.down('#btnReset').enable();
		this.down('#btnSave').enable();
		if (!this.disableEvents) {
			this.fireEvent('dataChanged');
		}
	},

/**
	 * Запрещение кнопки "Удалить пользователя"
	 */
	disableTakeAway: function() {
		this.down('#btnRemoveAccess').disable();
	},

/**
	 * Разрешение кнопки "Удалить пользователя"
	 */
	enableTakeAway: function() {
		this.down('#btnRemoveAccess').enable();
	},

/**
	 * Изменение доступности кнопки "Удалить пользователя" в связи
	 * с изменением выделения в гриде
	 */
	userSelected: function() {
		if (this.accessList.getSelectionModel().selected.getCount() == 1) {
			this.enableTakeAway();
		}
		else {
			this.disableTakeAway();
		}
	},

/**
	 * Запись ссылок на элементы управления во внутренние поля объекта
	 */
	setInternalControls: function() {
		this.rAccessDenied = this.accTypeForm.getComponent('rAccessDenied');
		this.rAccessSelected = this.accTypeForm.getComponent('rAccessSelected');
		this.rAccessAll = this.accTypeForm.getComponent('rAccessAll');
		this.accessList = this.down('panel').getComponent('accessList');
	},

/**
	 * Убирает выбранного пользователя из списка доступа
	 */
	removeFirm: function() {
		if (this.accessList.getSelectionModel().selected.getCount() != 1) return;
		this.firmsStore.remove(
			this.accessList.getSelectionModel().selected.getAt(0));
		this.enableReset();
	},

/**
	 * Добавляет организацию в список доступа
	 */
	addFirm: function() {
		if (!this.searchWindow) {
			this.createSearchWindow();
		}
		var firms = [];
		this.firmsStore.each(function(firm){
			firms.push(firm.get('name'));
		});
		var firmname = C.getSetting('f.name');
		firms.push(firmname);
		this.searchWindow.setAddedFirms(firms);
		this.searchWindow.show();
		this.enableReset();
	},

/**
	 * Перезагрузка прав доступа
	 */
	reset: function() {
		var obj = this.objectId;
		this.objectId = 0;
		this.load(obj);
	},

/**
	 * Сохранение прав доступа
	 */
	save: function() {
		var firms = [];
		var firmsCache = [];
		this.firmsStore.each(function(firm){
			firms.push(firm.get('firmid'));
			firmsCache.push(firm);
		});
		var forall = 0;
		if (this.rAccessAll && this.rAccessAll.getValue()) {
			forall = 1;
		}
		var shared = 1;
		if (this.rAccessDenied && this.rAccessDenied.getValue()) {
			shared = 0;
		}
		Ext.Ajax.request({
			scope: this,
			url: '/access/set',
			params: {
				obj: this.objectId,
				forall: forall,
				shared: shared,
				firms: Ext.encode(firms)
			},
			success: function(response) {
				try {
					var result = Ext.decode(response.responseText);
					if (result.success) {
						O.msg.info(this.lngSavingOk);
						this.disableReset();
						//Updating cache
						this.accessCache.removeAtKey(this.objectId);
						this.accessCache.add(this.objectId, {
							canshare: true,
							forall: forall,
							users: firmsCache,
							success: true
						});
					}
					else {
						this.showSavingError();
					}
				}
				catch (e) {
					this.showSavingError();
				}
			}
		});
	},

/**
	 * Вывести "Ошибка при сохранении" или что-то вроде того
	 */
	showSavingError: function() {
		O.msg.error(this.lngSavingError);
	},

/**
	 * Вывести "Ошибка при сохранении" или что-то вроде того
	 */
	showLoadingError: function() {
		O.msg.error(this.lngLoadingError);
	},

/**
	 * Изменение выбранного типа доступа к объекту
	 */
	onAccTypeChange: function(field, newValue) {
		if (this.rAccessDenied.getValue() || this.rAccessAll.getValue()) {
			this.accessList.disable();
		}
		else {
			this.accessList.enable();
		}
		this.enableReset();
		if (!newValue) return;
	},

/**
	 * Установка вида компонента в соответствии с параметрами
	 * @param {int} sharedaccess - разрешен ли общий доступ
	 * @param {int} forall - расшарен ли объект для всех
	 * @param {int} users - список пользователей, для которых он расшарен
	 */
	setSharedAccess: function(sharedaccess, forall, firms) {
		this.firmsStore.removeAll();
		if (!this.rAccessDenied) {
			this.setInternalControls();
		}
		if (sharedaccess == 0/* || firms.length == 0*/) { //Шара закрыта
			this.rAccessDenied.setValue(true);
		}
		else {
			if (forall == 1) { //Шара для всех
				this.rAccessAll.setValue(true);
			}
			else { //Шара не для всех
				this.rAccessSelected.setValue(true);
				if (Ext.isArray(firms))
					this.firmsStore.loadData(firms);
				this.accessList.enable();
			}
		}
		this.enable();
	},

/**
	* Load access data from object
	* @param {Object} obj Object with access rights
	* @param {integer} objectid ID of object
	*/
	loadAccessObject: function(obj, objectid) {
		this.objectId = objectid;
		if (!obj.canshare) { //Если нет прав на расшаривание этого объекта
			this.disable();
			this.objectId = 0;
		}
		else {
			this.enable();
			this.setSharedAccess(obj.sharedaccess,
				obj.forall, obj.users);
		}
	},

/**
	 * Загрузка информации о расшаривании объекта
	 * @param {int} objectid - ID объекта
	 */
	load: function(objectid) {
		if (this.objectId == objectid) return;
		this.lock();
		this.disableEvents = true;
		//check cache for necessary object
		if (this.accessCache.containsKey(objectid)) {
			this.loadAccessObject(this.accessCache.get(objectid), objectid);
		}
		else {
			Ext.Ajax.request({
				url: '/access/load',
				params: {
					objId: objectid
				},
				success: function(response) {
					try {
						var param = Ext.decode(response.responseText);
						if (param.success) {
							this.accessCache.add(objectid, param);
							this.loadAccessObject(param, objectid);
						}
						else {
							this.showLoadingError();
						}
						this.disableEvents = false;
					}
					catch (e) {
						this.showLoadingError();
					}
					this.unlock();
					this.disableReset();
				},
				scope: this
			});
		}
	}
});