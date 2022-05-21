/**
 *
 * Period chooser toolbar
 * @class O.toolbar.PeriodChooser
 * @extends Ext.Toolbar
 */
C.define('O.toolbar.PeriodChooser', {
	extend: 'Ext.Toolbar',
	alias: 'widget.periodchooser',

	border: 0,
	enableOverflow: true,

/** Translatable fields */
	msgReload: 'Reload',
	msgLoad: 'Load',
	msgPeriodFrom: 'Objects for the period from',
	msgPeriodTo: 'to',
	msgPresets: {
		TODAY: {
			text: 'Today',
			tooltip: 'Data for today'
		},
		YESTERDAY: {
			text: 'Yesterday',
			tooltip: 'Data for yesterday'
		},
		TWODAYS: {
			text: '2 days',
			tooltip: 'Data for the last two days'
		},
		WEEK: {
			text: 'Week',
			tooltip: 'Data for the current week'
		},
		TENDAYS: {
			text: '10 days',
			tooltip: 'Data for the last ten days'
		},
		MONTH: {
			text: 'Month',
			tooltip: 'Data for the current month'
		},
		PREVMONTH: {
			text: 'Previous month',
			tooltip: 'Data for the previous month'
		},
		YEAR: {
			text: 'Year',
			tooltip: 'Data for the current year'
		}
	},

/**
	* List of predefined date periods
	* @type Object
	*/
	presets: null,

/**
	* Список предустановленных периодов
	* @type Array
	*/
	presetsList: null,

/**
	* Название предустановленного периода, который
	* будет загружен после отрисовки компонента.
	* Можно присвоить значение null или '', чтобы не загружать ничего
	* @type String
	*/
	autoLoadPreset: 'TODAY',

/**
	* Если true, то кнопка "Обновить" не видна
	* @type Boolean
	*/
	hideReloadButton: false,

/**
	* Если true, то кнопка "Загрузить" не видна
	* @type Boolean
	*/
	hideLoadButton: false,

/**
	* Мгновенная загрузка данных при выборе пресетов
	* или при выборе даты
	* @type Boolean
	* @warning Not implemented
	*/
	immediateLoad: false,

/**
	* Поле с датой начала периода
	* @type Ext.form.DateField
	* @protected
	*/
	fieldSdt: null,

/**
	* Поле с датой конца периода
	* @type Ext.form.DateField
	* @protected
	*/
	fieldEdt: null,

/**
	* Объект последних загруженных параметров для сравнения
	* @type Object
	* @protected
	*/
	lastParams: null,

/**
	* Component initialization
	* @constructs
	*/
	initComponent: function() {
		this.initPresets();

		// Заполняем список предустановленных периодов, если
		// еще он не заполнен при вызове конструктора
		if (!this.presetsList) {
			this.presetsList = [
				'TODAY',
				'YESTERDAY',
				'TWODAYS',
				'WEEK',
				'TENDAYS',
				'MONTH',
				'PREVMONTH',
				'YEAR'
			];
		}

		this.lastParams = {};
		var sdtId = Ext.id();
		var edtId = Ext.id();

		// создаем поля дат периода
		this.fieldSdt = Ext.widget('datetimefield', {
			id: sdtId,
			vtype: 'daterange',
			//width: 90,
			editable: false,
			timeFormat: 'H:i'
		});

		this.fieldEdt = Ext.widget('datetimefield', {
			id: edtId,
			vtype: 'daterange',
			//width: 90,
			editable: false,
			timeFormat: 'H:i'
		});

		this.fieldSdt.endDateField = this.fieldEdt;
		this.fieldEdt.startDateField = this.fieldSdt;

		var layerStyle = {
			paddingLeft: '5px',
			paddingRight: '5px'
		};

		Ext.apply(this, {
			items: [{
				xtype: 'label',
				text: this.msgPeriodFrom,
				style: layerStyle
			},
				this.fieldSdt,
			{
				xtype: 'label',
				text: this.msgPeriodTo,
				style: layerStyle
			},
				this.fieldEdt,
			{
				text: this.msgReload,
				action: 'reload',
				iconCls: 'reload',
				hidden: this.hideReloadButton
			}, {
				text: this.msgLoad,
				action: 'load',
				iconCls: 'load',
				disabled: true,
				hidden: this.hideLoadButton
			}, {
				xtype: 'tbseparator'
			}]
		});
		//this.height = 32;
		this.callParent(arguments);
		this.addEvents(
			/**
			 * @event load
			 * Событие, которое происходит при выборе периода
			 * @param {Object} Period {sdt, edt} Выбранный период
			 * @param {Function} Callback
			 */
			'load'
		);
	},

/**
	* Date presets initialization
	*/
	initPresets: function() {
		this.presets = {
			TODAY: {
				fn: function() {
					var now = new Date();
					var e = now.setEndOfADay(true);
					var s = now.setStartOfADay(true);
					return {
						edt: e,
						sdt: s
					}
				}
			},
			YESTERDAY: {
				fn: function() {
					var now = Ext.Date.add(new Date(), Ext.Date.DAY, -1);
					var e = now.setEndOfADay(true);
					var s = now.setStartOfADay(true);
					return {
						edt: e,
						sdt: s
					}
				}
			},
			TWODAYS: {
				fn: function() {
					var now = new Date();
					var e = now.setEndOfADay(true);
					var s = now.add(Ext.Date.DAY, -1).clearTime();
					return {
						edt: e,
						sdt: s
					}
				}
			},
			WEEK: {
				fn: function() {
					var now = new Date();
					var dow = parseInt(Ext.Date.format(now, 'N'));
					var e = now.setEndOfADay(true);
					var s = now.add(Ext.Date.DAY, 1 - dow).clearTime();
					return {
						edt: e,
						sdt: s
					}
				}
			},
			TENDAYS: {
				fn: function() {
					var now = new Date();
					var e = now.setEndOfADay(true);
					var s = now.add(Ext.Date.DAY, -9).clearTime();
					return {
						edt: e,
						sdt: s
					}
				}
			},
			MONTH: {
				fn: function() {
					var now = new Date();
					var e = now.setEndOfADay(true);
					var s = now.getFirstDateOfMonth().clearTime();
					return {
						edt: e,
						sdt: s
					}
				}
			},
			PREVMONTH: {
				fn: function() {
					var now = new Date();
					var som = now.getFirstDateOfMonth().clearTime();
					var e = som.add(Ext.Date.DAY, -1).setEndOfADay(true);
					var s = som.add(Ext.Date.MONTH, -1);
					return {
						edt: e,
						sdt: s
					}
				}
			},
			YEAR: {
				fn: function() {
					var now = new Date();
					var y = Ext.Date.format(now, 'Y');
					var e = now.setEndOfADay(true);
					var s = Ext.Date.parse(y + "0101000000", "YmdHis");
					return {
						edt: e,
						sdt: s
					}
				}
			}
		}
		for (var preset in this.presets) {
			Ext.apply(this.presets[preset], this.msgPresets[preset]);
		}
	},

/**
	* Adds predefined (but not showed initially) preset into toolbar panel
	* @param {String} presetName Name of the preset
	* @return {Ext.button.Button}
	*/
	addPreset: function(presetName) {
		var preset = this.presets[presetName];
		if (!preset) { return null; }
		var pressed = false;
		if (this.autoLoadPreset === presetName) {
			pressed = true;
		}
		return this.add({
			xtype: 'button',
			preset: presetName,
			text: preset.text,
			pressed: pressed,
			tooltip: preset.tooltip,
			toggleGroup: 'datepreset',
			enableToggle: true,
			fn: preset.fn
		});
	}

});
