/**
 * Period chooser toolbar
 * @class M.lib.periodchooser.Toolbar
 * @extends Ext.Toolbar
 */
Ext.define('M.lib.periodchooser.Toolbar', {
	extend: 'Ext.Toolbar',
	alias: 'widget.periodchooser',

	border: 0,
	enableOverflow: true,

/** Translatable fields */
	msgPeriodFrom: 'Period from',
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
		},
		CUSTOM: {
			text: 'As chosen:',
			tooltip: 'Manually selected period'
		}
	},

	config: {
		scrollable: 'horizontal',
		/**
		 * Мгновенная загрузка данных при выборе пресетов
		 * или при выборе даты
		 * @type Boolean
		 */
		immediateLoad: false,

		/**
		 * Дополнительные элементы которые надо добавить в начало тулбара
		 * @type Array
		 */
		beforeItems: [],

		/**
		 * Дополнительные элементы которые надо добавить в конец тулбара
		 * @type Array
		 */
		afterItems: []
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
	* Объект последних загруженных параметров для сравнения
	* @type Object
	* @protected
	*/
	lastParams: null,

/**
	* Component initialization
	* @constructs
	*/
	initialize: function() {
		this.callParent(arguments);
		var items = [{
			action: 'load',
			iconCls: 'refresh',
			disabled: true,
			hidden: this.hideLoadButton
		}, {
			xtype: 'selectfield',
			itemId: 'fieldInterval'
		}, {
			xtype: 'component',
			html: this.msgPeriodFrom,
			itemId: 'labelFrom',
			cls: 'toolbar-label'
		}, {
			xtype: 'datetimefield',
			itemId: 'fieldSdt',
			//editable: false,
			dateFormat: 'd.m.Y',
			timeFormat: 'H:i'
		}, {
			xtype: 'component',
			html: this.msgPeriodTo,
			itemId: 'labelTo',
			cls: 'toolbar-label'
		}, {
			xtype: 'datetimefield',
			itemId: 'fieldEdt',
			//editable: false,
			dateFormat: 'd.m.Y',
			timeFormat: 'H:i'
		}];


		this.setItems(this.addCustomItems(items));
		var options = this.initPresets();

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
				'YEAR',
				'CUSTOM'
			];
		}

		this.lastParams = {};

		this.btnLoad = this.down('button[action=load]');
		// создаем поля дат периода
		this.fieldSdt = this.down('#fieldSdt');
		this.fieldEdt = this.down('#fieldEdt');
		this.labelFrom = this.down('#labelFrom');
		this.labelTo = this.down('#labelTo');
		this.fieldInterval = this.down('#fieldInterval');

		this.fieldSdt.endDateField = this.fieldEdt;
		this.fieldEdt.startDateField = this.fieldSdt;

		this.fieldInterval.setOptions(options);
	},

	/**
	 * Adds additional items to toolbar
	 */
	addCustomItems: function(items) {
		Ext.each(this.getBeforeItems().reverse(), function(item){
			items.unshift(item);
		});
		Ext.each(this.getAfterItems(), function(item){
			items.push(item);
		});
		return items;
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
			},
			CUSTOM: {
				fn: function() {
					return {
						sdt: this.fieldSdt.getValue(),
						edt: this.fieldEdt.getValue()
					}
				}
			}
		}
		var options = [];
		for (var preset in this.presets) {
			Ext.apply(this.presets[preset], this.msgPresets[preset]);
			options.push({
				text: this.msgPresets[preset].text,
				value: preset,
				fn: this.presets[preset].fn
			});
		}
		return options;
	}
});
