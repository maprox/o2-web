/**
 *
 * Settings panel class
 * @class O.comp.SettingsPanel
 * @extends Ext.form.FormPanel
 */
C.define('O.comp.SettingsPanel', {
	extend: 'Ext.form.FormPanel',
	mixins: ['C.ui.Panel'],

	bodyPadding: 10,
	border: false,
	autoScroll: true,

/**
	* Массив загруженных хранилищ
	* @type Object
	*/
	stores: null,

/**
	* Флаг загрузки данных
	* @type Boolean
	*/
	isLoaded: false,

/**
	* Last received data
	*/
	//lastReceivedData: null,

/**
	* @constructs
	* @param {Object} config Объект конфигурации
	*/
	initComponent: function() {
		this.callParent(arguments);
		this.on('afterrender', this.onAfterRender, this);
		this.addEvents('clientvalidation');
	},

/**
	* Метод создания формы (чтобы работал trackResetOnLoad)
	* @return {Ext.form.BasicForm}
	* @protected
	*/
	createForm: function() {
		var config = Ext.applyIf({
			trackResetOnLoad: true,
			listeners: {}
		}, this.initialConfig);
		var frm = new Ext.form.Basic(this, config);
		var fn = function(form, value) {
			if (this.isLoaded) {
				this.fireEvent('clientvalidation', this.getValidateForm(), value);
			}
		};
		frm.on({
			validitychange: fn,
			dirtychange: fn,
			scope: this
		});

		return frm;
	},

/**
	* Функция инициализации данных формы настроек
	* @protected
	*/
	onAfterRender: function() {
		this.lock();
		this.applyData();
	},

/**
	* Returns user settings collection
	* @param {Function} fn - Callback function
	* @param {Object} scope - Callback function scope
	*/
	getSettings: function(fn, scope) {
		/*if (this.lastReceivedData && this.lastReceivedData.settings) {
			var s = new Ext.util.MixedCollection();
			s.addAll(this.lastReceivedData.settings);
			//this.lastReceivedData = null;
			fn.call(scope, s, true);
		} else {
			C.get('settings', fn, scope);
		}*/
		C.get('settings', fn, scope);
	},

/**
	* Fill in the form panel fields
	* @protected
	*/
	applyData: function(data) {
		//this.lastReceivedData = data;
		// If data given (e.g. as result of saving settings)
		/*if (data && data.settings) {
			this.getForm().setValues(data.settings);
			this.isLoaded = true;
		} else {*/
		this.getSettings(function(s, success) {
			this.unlock();
			if (!success) { return; }
			this.getForm().setValues(s.getRange());

			this.isLoaded = true;
		}, this);
		//}
	},

/**
	* Функция, которая возвращает измененные пользователем настройки<br/>
	* Может быть переопредела в потомках, при необходимости
	* @protected
	*/
	getChangedData: function() {
		var result = [];
		this.getSettings(function(s, success) {
			s.each(function(item) {
				var f = this.getForm().findField(item.id);
				if (f) {
					if (f.isDirty()) {
						result.push({
							id: f.getName(),
							value: f.getValue()
						});
					}
				}
			}, this)
		}, this);

		return result;
	},

/**
	* Sets default data
	*/
	setDefaultData: function() {
		this.getForm().reset();
	},

/**
	* Have changes
	*/
	haveDirty: function() {
		return this.getForm().isDirty();
	},

/**
	* Is valid
	*/
	isValid: function() {
		return this.getForm().isValid();
	},

/**
	* Fetches form for validation
	* @return {Ext.form.Basic}
	*/
	getValidateForm: function() {
		return this.getForm();
	},

/**
	* Returns error list for errors popup.
	* @return {Object[]}
	*/
	getErrors: function() {
		var errors = [];

		if (this.rendered) {
			this.getForm().getFields().each(function(field) {
				Ext.each(field.getErrors(), function(error) {
					errors.push({
						label: field.getFieldLabel(),
						error: error,
						name: field.getName()
					});
				});
			});
		}

		return errors;
	}
});
