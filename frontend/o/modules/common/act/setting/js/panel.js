/**
 * User settings panel
 * @class O.settings.Panel
 * @extends C.ui.Panel
 */
C.define('O.settings.Panel', {
	extend: 'C.ui.Panel',
	alias: 'widget.act_admin_settings',

/**
	* Массив панелей настроек
	* @type Ext.form.FormPanel[]
	* @private
	*/
	panels: null,

/**
	* Массив панелей, которые не прошли проверку на валидность
	* @type Ext.form.FormPanel[]
	* @private
	*/
	notValidPanels: null,

/**
	* Счетчик обновлений хранилищ данных на панели
	* @type Number
	* @protected
	*/
	updatesCount: 0,

/**
	* @constructs
	* @param {Object} config Объект конфигурации
	*/
	initComponent: function() {
		this.panels = [];
		this.notValidPanels = [];
		this.formErrors = Ext.widget('formerrors');
		Ext.apply(this, {
			title: _('Settings'),
			layout: 'fit',
			border: false,
			items: [Ext.widget('otabpanel', {
					tabWidth: 200,
					activeTab: 0,
					items: this.createTabs()
			})],
			dockedItems: [{
				xtype: 'toolbar',
				dock: 'top',
				items: [{
					text: _('Save'),
					itemId: 'btnSave',
					iconCls: 'btn-save',
					handler: Ext.bind(this.save, this)
				}, {
					text: _('Cancel'),
					itemId: 'btnCancel',
					iconCls: 'btn-cancel',
					handler: Ext.bind(this.cancel, this)
				}, {
					xtype: 'tbseparator'
				},
				this.formErrors]
			}]
		});
		C.bind('settings', this);
		this.callParent(arguments);
		this.initStores();
	},

/**
	* Функция применения изменений
	* @param {Object} data
	*/
	applyChanges: function(data) {
		Ext.each(this.panels, function(panel) {
			if (panel.isLoaded) {
				panel.applyData(data);
			}

			// Included panels
			if (panel.includedPanels && panel.includedPanels.length) {
				Ext.Array.each(panel.includedPanels, function(p) {
					p.applyData(data);
				});
			}
		});
	},

/**
	* Сохранение настроек
	*/
	save: function() {
		var data = [];
		var valid = true;
		Ext.each(this.panels, function(panel) {
			if (panel.isLoaded) {
				valid = valid && panel.isValid();
				data = data.concat(panel.getChangedData());
			}

			// Included panels
			if (panel.includedPanels && panel.includedPanels.length) {
				Ext.Array.each(panel.includedPanels, function(p) {
					data = data.concat(p.getChangedData());
				});
			}
		}, this);
		if (!valid) {
			// TODO Сообщать об ошибке?
			return;
		}
		if (data.length == 0) { return; }
		this.setLoading(true);
		O.manager.Model.set('settings', data, function(success, result) {
			O.manager.Model.getProxy('settings').setDirty();
			if (success) {
				O.msg.info(_('Settings saved successfully'));
				this.applyChanges(result.data);
				// let's fire update event, because we would not
				// get answer from server
				/* TODO
				var curatorName = 'settings';
				var s = O.manager.Model.getCurator(curatorName);
				if (s) {
					var data = this.getSettingsData();
					if (!Ext.isEmpty(data)) {
						s.fireEvent('update', data, curatorName);
					}
				} */
			}
			this.setLoading(false);
		}, this);
	},

/**
	* TODO
	*/
	getSettingsData: function() {
		var list = [];
		var s = C.getSettings();
		if (s) {
			s.each(function(item) {
				list.push(new O.model.Option({
					id: item.id,
					type: item.type,
					value: item.value
				}));
			});
		}
		return list;
	},

/**
	* Отмена редактирования настроек
	*/
	cancel: function() {
		// [fix] Возвращаем настройку темы интерфейса
		//O.ui.Desktop.restoreTheme();
		// закрываем окно
		Ext.each(this.panels, function(panel) {
			if (panel.isLoaded) {
				panel.setDefaultData();
			}
		}, this);
	},

/**
	* Функция создания окна настройки, исходя из доступа пользователя
	* @return {Array}
	* @private
	*/
	createTabs: function() {
		var tabs = [
			'personal.base',
			'map.base',
			'firm.base',
			'auth.base',
			'notification.base'
		];
		if (C.userHasRight('module_welcome_settings')) {
			tabs.push('welcome.base');
		}
		Ext.each(tabs, function(tab) {
			var fnValidate = Ext.bind(this.frmValidate, this);
			var tabObject = Ext.data.StoreMgr.get(tab);
			if (Ext.isEmpty(tabObject)) { return true; }
			if (tabObject.accessible()) {
				var panel = new tabObject.type({
					listeners: {
						clientvalidation: fnValidate
					}
				});

				this.panels.push(panel);
				if (panel.getForm) {
					this.formErrors.registerForm(panel);
				}
			}
			return true;
		}, this);
		return this.panels;
	},

/**
	* Проверка валидности панели настроек
	* @param {Ext.form.FormPanel} form Панель настроек
	* @param {Boolean} valid Флаг валидности данных
	*/
	frmValidate: function(form, valid) {
		// для начала проверка на валидность
		if (form.isValid()) {
			Ext.Array.remove(this.notValidPanels, form);
		} else {
			if (Ext.Array.indexOf(this.notValidPanels, form) < 0) {
				this.notValidPanels.push(form);
			}
		}
		var saveEnabled = Ext.isEmpty(this.notValidPanels);

		if (saveEnabled) {
			// теперь проверка на измененные данные
			// данные где-то должны быть изменены
			saveEnabled = false;
			Ext.each(this.panels, function(panel) {
				if (panel.haveDirty()) {
					saveEnabled = true;
					return false;
				}

				// Included panels
				if (panel.includedPanels && panel.includedPanels.length) {
					Ext.Array.each(panel.includedPanels, function(p) {
						if (p.haveDirty()) {
							saveEnabled = true;
							return false;
						}
					});
				}
				return true;
			}, this);
		}
		var dockedItems = this.getDockedItems('toolbar');
		if (Ext.isEmpty(dockedItems)) {
			return;
		}
		var btn = dockedItems[0].down('#btnSave');
		if (btn) {
			btn.setDisabled(!saveEnabled);
		}
	},

/**
	* Stores initialization
	*/
	initStores: function() {
		var owner = this;
		var loadStore = function(storeName, local) {
			var store = Ext.StoreMgr.get(storeName);
			if (store && store.getCount() == 0 && !store.isLoading()) {
				if (local) {
					store.load();
				} else {
					owner.updatesCount += 1;
					store.load({
						callback: owner.onStoreLoad,
						scope: owner
					});
				}
			}
		};
		loadStore('store-utc');
		loadStore('store-language');
	},

/**
	* Data update after settings load
	* @protected
	*/
	onStoreLoad: function(records, operation, success) {
		this.updatesCount--;
		if (this.updatesCount <= 0) {
			this.applyData();
		}
	},

/**
	* Fill in panels with user settings
	*/
	applyData: function() {
		Ext.each(this.panels, function(panel) {
			panel.applyData();
		}, this);
	},

/**
	* Settings update
	*/
	onUpdateSettings: function(data) {
		this.applyChanges(data);
	}
});
