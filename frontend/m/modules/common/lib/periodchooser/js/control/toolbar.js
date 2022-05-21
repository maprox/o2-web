/**
 * Period chooser toolbar
 * @class M.lib.periodchooser.Toolbar
 */
C.utils.inherit('M.lib.periodchooser.Toolbar', {
/**
	* @constructs
	*/
	initialize: function() {
		this.callOverridden(arguments);
		this.lastParams = null;
		if (this.btnLoad) {
			this.btnLoad.on('tap', 'reload', this);
		}
		// Set up listeners for date fields
		var listenersConf = {
			select: 'onDateFieldSelect',
			change: 'onDateFieldSelect',
			scope: this
		}
		this.fieldSdt.on(listenersConf);
		this.fieldEdt.on(listenersConf);
		this.fieldInterval.on('change', 'onFieldIntervalChange', this);

		// Load preset on load if needed
		if (this.autoLoadPreset) {
			this.on('painted', function() {
				this.selectPreset(this.autoLoadPreset);
			}, this, {single: true});
		} else {
			var dt = new Date()
			this.fieldSdt.setValue(dt);
			this.fieldEdt.setValue(dt);
		}
	},

/**
	* Обработчик выбора периода
	* @param {Object} cmp Компонент
	* @param {Object} record Выбранная запись
	*/
	onFieldIntervalChange: function(cmp, record) {
		if (record) {
			this.selectPreset(record);
		}
	},

/**
	* Preset selection
	* @param {String} presetName Name of preset from this.presets array
	*/
	selectPreset: function(presetName) {
		if (typeof(this.presets[presetName]) == 'undefined'
			|| !Ext.isFunction(this.presets[presetName].fn)) {
			return;
		}
		var params = this.presets[presetName].fn.call(this);
		this.fieldSdt.setValue(params.sdt);
		this.fieldEdt.setValue(params.edt);
		var valid = this.validNewPeriod(params.sdt, params.edt);
		this.btnLoad.setDisabled(!valid);
	},

/**
	* Проверка является ли период новым
	* @param {Date} sdt
	* @param {Date} edt
	*/
	validNewPeriod: function(sdt, edt) {
		if (!Ext.isDate(sdt) || !Ext.isDate(edt)) { return false; }
		if (edt - sdt < 0) { return false; }
		if (!this.lastParams) { return true; }
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
		if (sdt && sdt.clearTime) { sdt.clearTime(); }
		if (edt && edt.setHours) { edt.setHours(23, 59, 59); }
		var valid = this.validNewPeriod(sdt, edt);
		this.btnLoad.setDisabled(!valid);
		this.fieldInterval.setValue('CUSTOM');
		for (var presetName in this.presets) {
			var preset = this.presets[presetName];
			if (preset && Ext.isFunction(preset.fn)) {
				var params = preset.fn.call(this);
				var format = 'Y-m-d H:i:s';
				if (params.sdt.equal(sdt) &&
					Ext.Date.format(params.edt, format) ==
					Ext.Date.format(edt, format)) {
					this.fieldInterval.setValue(presetName);
					break;
				}
			}
		}
		if (
			this.getImmediateLoad()
			&& !C.utils.equals(this.lastParams, params)
		) {
			this.lastParams = params;
			this.fireEvent('load', params,
				Ext.bind(this.onLoaded, this));
		}
		this.fireEvent('periodchange');
	},

/**
	* Reload data for selected period.
	* Fires event #load with selected period.
	* @param {Boolean} notValidate
	*/
	reload: function(notValidate) {
		var period = this.getPeriod(notValidate);
		if (period == null) { return; }
		this.lastParams = period;
		this.fireEvent('load', this.lastParams,
			Ext.bind(this.onLoaded, this));
	},

	/*
	 * Returns current selected period
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
	* Callback function, wich is called after loading of data
	* @param {Boolean} success Success flag
	* @private
	*/
	onLoaded: function(success) {},

/**
	* Returns current period as text.
	* @param {Boolean} noPresetNames If true, then returns only period
	* representation eq. 22.12.2011 - 23.12.2011
	* @return {String}
	*/
	getPeriodAsText: function(noPresetNames) {
		var period = this.getPeriod(true);
		if (!period) { return ''; }
		//var str_sdt = period.sdt;
		//var str_edt = period.edt;
		return 'Some period';
	}
});
