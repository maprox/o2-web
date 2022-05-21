/**
 *
 * Period chooser toolbar
 * @class O.toolbar.PeriodChooser
 * @extends Ext.Toolbar
 */
C.utils.inherit('O.toolbar.PeriodChooser', {

/**
	* Объект последних загруженных параметров для сравнения
	* @type Object
	*/
	lastParams: null,

/**
	* @constructs
	*/
	initComponent: function() {
		this.callOverridden();

		// Load presets
		Ext.each(this.presetsList, function(presetName) {
			this.addPreset(presetName);
		}, this);

		this.btnLoad = this.down('button[action=load]');
		if (!this.btnLoad) {
			console.error("Error: No button found with action: 'load'");
		}
		this.btnLoad.setHandler(this.reload, this);

		this.btnReload = this.down('button[action=reload]');
		if (this.btnReload) {
			this.btnReload.setHandler(Ext.bind(this.reload, this, [true]));
		}

		// Настройка полей ввода даты
		var listenersConf = {
			select: this.onDateFieldSelect,
			change: this.onDateFieldSelect,
			scope: this
		}
		this.fieldSdt.on(listenersConf);
		this.fieldEdt.on(listenersConf);

		// Если указан предустановленный период при загрузке - загружаем его
		if (this.autoLoadPreset) {
			this.on('afterrender', function() {
				this.selectPreset(this.autoLoadPreset);
			}, this);
		}
	},

/**
	* Добавление предустановленного периода
	* @param {String} presetName Имя периода из массива this.presets
	* @return {Ext.button.Button} Объект кнопки
	*/
	addPreset: function(presetName) {
		var btn = this.callOverridden(arguments);
		if (btn) {
			btn.on('toggle', this.onPresetClick, this);
		}
	},

/**
	* Выбор предустановленного периода
	* @param {String} presetName Имя периода из массива this.presets
	* @return {Boolean} Период выбран
	*/
	selectPreset: function(presetName) {
		var button = this.down('button[preset=' + presetName + ']');

		if (!button) { return; }
		var params = button.fn.call(this);
		this.fieldSdt.setRawValue(this.fieldSdt.valueToRaw(params.sdt));
		this.fieldEdt.setRawValue(this.fieldEdt.valueToRaw(params.edt));
		this.fieldSdt.validate();
		var valid = this.validNewPeriod(params.sdt, params.edt);
		this.btnLoad.setDisabled(!valid);
		//button.toggle(true, true);
		if (this.immediateLoad) {
			this.lastParams = params;
			this.fireEvent('load', params, Ext.bind(this.onEventsLoaded, this));
		}
		this.fireEvent('periodChange');
	},

/**
	* Проверка является ли период новым
	* @param {Date} sdt
	* @param {Date} edt
	*/
	validNewPeriod: function(sdt, edt) {
		if (!Ext.isDate(sdt) || !Ext.isDate(edt)) { return false; }
		if (edt - sdt < 0) { return false; }
		return (!sdt.equal(this.lastParams.sdt)
			 || !edt.equal(this.lastParams.edt));
	},

/**
	* Выбор даты из выпадающего меню поля DateField
	* @param {Ext.form.DateField} field Объект DateField
	* @param {Date} dt Выбранная дата
	*/
	onDateFieldSelect: function(field, dt) {
		var sdt = this.fieldSdt.getValue();
		var edt = this.fieldEdt.getValue();
		if (!Ext.isDate(sdt) || !Ext.isDate(edt)) { return; }
		edt.setSeconds('59');
		//sdt.setStartOfADay();
		//edt.setEndOfADay();
		var valid = this.validNewPeriod(sdt, edt);
		this.btnLoad.setDisabled(!valid);
		for (var presetName in this.presets) {
			var button = this.down('button[preset=' + presetName + ']');
			if (button && Ext.isFunction(button.fn)) {
				var params = button.fn.call(this);
				var format = 'Y-m-d H:i:s';
				if (params.sdt.equal(sdt) && Ext.Date.format(params.edt, format) == Ext.Date.format(edt, format)) {
				//if (params.sdt.equal(sdt) && params.edt.equal(edt)) { //а так почему-то не работает, хотя даты равны
					button.toggle(true, true);
				} else {
					button.toggle(false, true);
				}
			}
		}
		this.fireEvent('periodChange');
		/* TODO: Error - вызывается два раза. Исправить
		if (this.immediateLoad) {
			this.lastParams = {sdt: sdt, edt: edt};
			this.fireEvent('load', this.lastParams,
					Ext.bind(this.onEventsLoaded, this));
		}
		*/
	},

/**
	* Загрузка данных за выбранный период
	* @param {Ext.Button} button
	* @param {Boolean} state
	*/
	onPresetClick: function(button, state) {
		if (!state || !Ext.isFunction(button.fn)) { return; }
		var params = button.fn.call(this);
		this.fieldSdt.setRawValue(this.fieldSdt.valueToRaw(params.sdt));
		this.fieldEdt.setRawValue(this.fieldEdt.valueToRaw(params.edt));
		this.fieldSdt.validate();
		// TODO: should better field itself deal with overflowClone?
		if (this.fieldSdt.overflowClone) {
			this.fieldSdt.overflowClone.setRawValue(
				this.fieldSdt.overflowClone.valueToRaw(params.sdt));
		}
		if (this.fieldEdt.overflowClone) {
			this.fieldEdt.overflowClone.setRawValue(
				this.fieldEdt.overflowClone.valueToRaw(params.edt));
		}
		var valid = this.validNewPeriod(params.sdt, params.edt);
		this.btnLoad.setDisabled(!valid);
		if (this.immediateLoad) {
			this.lastParams = params;
			this.fireEvent('load', params, Ext.bind(this.onEventsLoaded, this));
		}
	},

/**
	* Функция перезагрузки данных за выбранный период
	* @param {Boolean} notValidate
	*/
	reload: function(notValidate) {
		var period = this.getPeriod(notValidate);
		if (period == null) { return; }
		this.lastParams = period;
		this.fireEvent('load', this.lastParams,
				Ext.bind(this.onEventsLoaded, this));
	},

	/*
	 * Возвращает текущий выбранный период
	 * @param {Boolean} notValidate
	 * @return {Object}
	 */
	getPeriod: function(notValidate) {
		var sdt = this.fieldSdt.getValue();
		var edt = this.fieldEdt.getValue();
		if (!Ext.isDate(sdt) || !Ext.isDate(edt)) { return null; }
		//sdt.setStartOfADay();
		//edt.setEndOfADay();
		var valid = true;
		if (!notValidate) {
			valid = this.validNewPeriod(sdt, edt);
		}
		this.btnLoad.setDisabled(!valid);
		if (!valid) { return null; }
		return {
			sdt: sdt,
			edt: edt
		}
	},

/**
	* Колбэк функция после завершения загрузки данных
	*/
	onEventsLoaded: function(success) {
		this.btnLoad.disable();
	}
});
