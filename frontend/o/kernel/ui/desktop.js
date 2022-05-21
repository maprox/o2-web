/**
 * Application module manager
 * @class O.ui.Desktop
 * @extend Ext.util.Observable
 * @singleton
 */
Ext.define('O.ui.Desktop', {
	extend: 'Ext.util.Observable',
	singleton: true,

/**
	* Modules collection
	* @type {Ext.util.MixedCollection}
	* @private
	*/
	modules: null,

/**
	* Local settings collection.
	* Needed to compare with updated settings.
	* @type Ext.util.MixedCollection
	* @private
	*/
	lastSettings: null,

/**
	* Lock flag. If true prevent desktop tabs to be changed
	* @type Boolean
	* @private
	*/
	isDesktopLocked: false,

// EVENTS DESCRIPTION --------------------------

	/**
	 * @event moduleactivated
	 * Fires when module is activated
	 * @param {C.ui.Module} module
	 * @param {Object} params
	 */

	/**
	 * @event lock
	 * Fires when desktop is locked or unlocked
	 * @param {Boolean} lockValue
	 */

/**
	* Функция инициализации менеджера.<br/>
	* В процессе инициализации менеджер формирует список экшенов,
	* доступных пользователю из html страницы сформированной сервером.
	* @constructs
	*/
	init: function() {
		this.setLocked(false);
		this.initModulePanels();
		this.initDesktop();
		this.initModules();
		this.initSettings();
	},

/**
	* Initialization of specific desktop.
	* Should be overriden in child classes
	* @type Function
	*/
	initDesktop: function() {
		this.getViewport();
	},

/**
	* Initialization of module panels.
	* Sets 'module' field value for each module panel
	*/
	initModulePanels: function() {
		this.getModulesCollection().each(function(module) {
			if (module.panel) {
				var className =
					Ext.ClassManager.getNameByAlias('widget.' + module.panel);
				if (className) {
					C.utils.inherit(className, {module: module});
				}
			}
		});
	},

/**
	* Modules initialization
	*/
	initModules: function() {
		this.getModulesCollection().each(function(module) {
			module.init();
		});
	},

/**
	* Settings initialization
	*/
	initSettings: function() {
		C.bind('settings', this);
		C.get('settings', function(list, success) {
			if (success) {
				this.lastSettings = C.utils.clone(list);
			}
		}, this);
	},

/**
	* Returns an instance of an Ext.Viewport
	* @param {Boolean} createIfNotFound Creates viewport if not found
	* @return Ext.Viewport
	*/
	getViewport: function(createIfNotFound) {
		var me = this;
		var viewport = null;
		var searchResult = Ext.ComponentQuery.query('o-viewport');
		if (searchResult.length > 0) {
			viewport = searchResult[0];
		} else {
			if (createIfNotFound !== false) {
				viewport = Ext.widget('o-viewport');
			}
		}
		return viewport;
	},

/**
	* Updates connection status icon
	* @param Boolean connection
	*/
	updateConnectionStatus: function(connection) {
		console.debug('Desktop: update connection status', connection);
		var viewport = this.getViewport();
		viewport.updateConnectionStatus(connection);
	},

/**
	* User interface module registration
	* @param {C.ui.Module} module Object of ui-module
	*/
	register: function(module) {
		if (module && Ext.isString(module)) {
			module = Ext.create(module);
		}
		var mc = this.getModulesCollection();
		mc.add(module);
		mc.sort('weight', 'ASC');
	},

/**
	* Функция перебора зарегистрированных модулей интерфейса
	* @param {Function} fn Callback function
	* @param {Object} scope [opt.]
	*/
	each: function(fn, scope) {
		this.getModulesCollection().each(fn, scope);
	},

/**
	* Returns collection of modules
	* @return {Ext.util.MixedCollection}
	*/
	getModulesCollection: function() {
		if (!this.modules) {
			this.modules = new Ext.util.MixedCollection();

			// old version of module names
			// TODO to be removed after redactoring
			var modules = Ext.ClassManager.getNamesByExpression('O.ui.module.*');
			Ext.each(modules, function(className) {
				this.modules.add(Ext.create(className));
			}, this);

			// new version of module names
			modules = Ext.ClassManager.getNamesByExpression('*.act.*.Module');
			Ext.each(modules, function(className) {
				this.modules.add(Ext.create(className));
			}, this);

			this.modules.sort('weight', 'ASC');
		}
		return this.modules;
	},

/**
	* Returns modules array
	* @return {C.ui.Module[]}
	*/
	getModules: function() {
		return this.getModulesCollection().getRange();
	},

/**
	* Returns modules array
	* @return {C.ui.Module[]}
	*/
	getModulesByType: function(type) {
		return this.getModulesCollection().filter('type', type).getRange();
	},

/**
	* Возвращает объект модуля по его имени
	* @param {String} id Идентификатор модуля
	* @return {C.ui.Module}
	*/
	getModule: function(id) {
		return this.getModulesCollection().get(id);
	},

/**
	* Check if module exists
	* @param {String} id Module id
	* @return {Boolean}
	*/
	hasModule: function(id) {
		if (this.getModule(id)) {
			return true;
		}

		return false;
	},

/**
	* Вызов хендлера для модуля с идентификатором id
	* @param {String} id Идентификатор модуля
	* @param {Object[]} params An array of module params {name: '', value: ''}
	* @return {Object} Результат выполнения
	*/
	callModule: function(id, params) {
		var module = this.getModule(id);
		if (!module) { return null; }

		O.manager.History.disable(); // turn off history tracing
		var result = module.activate(params); // module activation
		O.manager.History.enable(); // turn on history tracing

		if (!this.isTerminated) {
			this.fireEvent('moduleactivated', module, params);
		}
		return result;
	},

/**
	* Редирект по указанной ссылке
	* @param location Ссылка
	*/
	location: function(location) {
		window.location = location;
	},

/**
	* Обработка события изменения настроек
	* @param {Object} data Список измененных настроек
	*/
	onUpdateSettings: function(data) {
		Ext.each(data, function(item) {
			// TODO Change language and theme without page reload
			if (item.id === 'p.lng' || item.id === 'p.theme') {
				var s = this.lastSettings.get(item.id);
				if (s && s.value !== item.value) {
					C.utils.reload();
				}
			}
		}, this);
		C.get('settings', function(list, success) {
			if (success) {
				this.lastSettings = C.utils.clone(list);
			}
		}, this);
	},

/**
	* Returns true if desktop is locked
	* @return {Boolean}
	*/
	isLocked: function() {
		return this.isDesktopLocked;
	},

/**
	* Sets lock value
	* @param {Boolean} value
	*/
	setLocked: function(value) {
		this.isDesktopLocked = value;
		this.fireEvent('lock', value);
	},

/**
	* Closing the application
	*/
	terminate: function(code, params) {
		this.isTerminated = true;
		var logoutParams = {name: 'forced', code: code};
		if (code == 4011) {
			logoutParams.ip = params.sessionData.ip;
			logoutParams.dt = params.sessionData.dt;
		}
		if (code == 4012) {
			logoutParams.nexttime = params.sessionData.nexttime;
		}

		if (code == 4052) {
			//logoutParams.contactUserId = params.contactUserId;
			logoutParams.contactStr = params.contactStr;
		}

		this.callModule('logout', [logoutParams]);
	}
});
