/**
 * @class O.sdesk.lib.issues.EditorPanel
 */
C.utils.inherit('O.sdesk.lib.issues.EditorPanel', {

/**
	* @event coords_pressed
	* Fires user presses jump button
	*/
/**
	* @event jump_finished
	* Fires when setting coords is finished
	*/

/**
	 * constructor
	 */
	initComponent: function() {
		this.callOverridden(arguments);
		this.tabProps.on({
			changed: this.changed,
			dirtychange: function(dirty){
				this.fireEvent('dirtychange', dirty);
			},
			scope: this
		});
	},

/**
	* Загрузка устройства в табпанель
	* @param {Object} record Объект устройства
	* @param {String[]} dontUpdateFields Поля, которые не надо обновлять.
	*/
	loadTabs: function(record, dontUpdateFields) {
		dontUpdateFields = dontUpdateFields || [];
		if (!record || !record.data/* || (record.data.id == 0)*/) {
			this.disable();
		} else {
			this.selected = record;
			// разблокировка панели
			this.enable();
			//загрузка параметров доступа
			this.tabProps.loadProps(record, dontUpdateFields);
			if (dontUpdateFields.length == 0) {
				// деактивация кнопок если тотальный апдейт
				this.btnsDisable();
			}
		}
	},

/**
	* Обработчик нажатия кнопки сохранения
	*/
	saveChanges: function() {
		this.setLoading(true);
		// сборка объекта данных
		var data = {
			id: (this.selected) ? this.selected.getId() : 0,
			name: this.tabProps.fieldName.getValue(),
			id_region: this.tabProps.fieldRegion.getValue(),
			address: this.tabProps.fieldAddress.getValue(),
			distributed: this.tabProps.fieldDistributed.getValue(),
			note: this.tabProps.fieldNote.getValue(),
			lat: this.tabProps.getLatitude(),
			lon: this.tabProps.getLongitude()
		};
		// отправка запроса на изменение данных устройства
		var mm = O.manager.Model;
		var fn = (data.id) ? mm.set : mm.add;
		fn.call(mm, 'dn_warehouse', data, function(success) {
			if (success) {
				O.msg.info(this.lngSavedText);
				// деактивация кнопок
				this.btnsDisable();
				this.fireEvent('saved');
			}
			this.setLoading(false);
		}, this);
	},

/**
	* Check if record is changed
	* @return {Boolean}
	*//*
	isValid: function() {
		var name = this.tabProps.fieldName.getValue();
		return (name && name.length);
	},*/

/**
	* Reloads data
	*/
	resetChanges: function() {
		if (this.selected) {
			var lat = this.selected.get('lat'),
				lon = this.selected.get('lon');

			this.tabProps.setLatitude(lat);
			this.tabProps.setLongitude(lon);

			this.tabMap.removeWarehouse();
			if (lat || lon) {
				this.tabMap.addWarehouse(lat, lon);
			}
		}
		this.callParent(arguments);
	},

/**
	* Устанавливает таб со свойствами активным табом
	*/
	setActiveTabFirst: function() {
		this.tabs.setActiveTab(this.tabProps);
	}

});
