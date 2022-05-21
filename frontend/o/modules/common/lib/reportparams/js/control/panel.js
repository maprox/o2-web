/**
 * @fileOverview Панель параметров отчета
 *
 * @class O.reports.Params
 * @extends Ext.panel.Panel
 */
C.utils.inherit('O.reports.Params', {
	initComponent: function() {
		this.callParent(arguments);
		this.addEvents('validityChange', 'paramsloaded', 'reportLoaded');
		this.reportsComponents = new Ext.util.MixedCollection();
		this.childsToRender = 0;
	},

/**
	 * Param panels
	 */
	panels: {},

	/*
	 * Создание панелей для заполнения параметров отчета
	 * @param {O.model.Report} report - Объект отчета
	 */
	loadReport: function(report) {
		if (this.childsToRender != 0) {
			return;
		}
		//this.clear();
		this.currentParamsControls = [];
		if (this.reportsComponents.containsKey(report.id)) {
			//Восстанавливаем набор элементов из коллекции
			// Hide all params panels
			this.reportsComponents.each(function(compSet) {
				Ext.each(compSet, function(item) {
					item.hide();
				});
			});
			// Load panels for specified report.id
			this.currentParamsControls = this.reportsComponents.get(report.id);
			Ext.each(this.currentParamsControls, function(control) {
				control.show();
			}, this);
		} else {
			var paramsControls = [];  //Создаем элементы и сохраняем их в коллекцию
			var me = this;
			this.childsToRender = report.params.length;
			this.clear();
			Ext.each(report.params, function(param) {
				var panel = null;

				if (Ext.Array.indexOf(
						// TODO: maybe this is not good
						['bool', 'int', 'float', 'string', 'date',
						 'maxspeed', 'period', 'device', 'zone'],
						param.param_type) > -1)
				{
					if (me.panels[param.param_type]) {
						panel = me.panels[param.param_type];
						panel.show();
						this.childRender();
					} else {
						panel = Ext.create(
							'O.reports.' + C.utils.ucfirst(param.param_type)
								+ 'Panel'
						);
						me.panels[param.param_type] = panel;

						if (panel != null) {
							//Задаем имя параметра для компонента, без него невозможно получить
							//значение, заданное пользователем
							panel.paramName = param.alias;
							panel.on({
								validitychange: this.setValid,
								afterrender: this.childRender,
								scope: this
							});
							me.insert(0, panel);
						}
					}

					paramsControls.push(panel);

				}
			}, this);

			// Сохраняем набор элементов для данного отчета в коллекции
			this.reportsComponents.add(report.id, paramsControls);
			this.currentParamsControls = paramsControls;
		}
		this.fireEvent('paramsloaded');
	},

	/*
	 * Вычисляем корректность заполенности всех полей
	 */
	setValid: function() {
		this.fireEvent('validityChange', this.checkValid());
	},

	checkValid: function() {
		var valid = true;
		Ext.each(this.currentParamsControls, function(item){
			//TODO: удалить
			if (item.isValid === undefined) {
				item.isValid = function() {return true;}
			}
			if (!item.isValid()) {
				valid = false;
			}
		}, this);
		return valid;
	},

	/*
	 * Получение списка параметров отчета, введенных в формы
	 */
	getValues: function() {
		var result = {};
		this.items.each(function(item){
			if (item.getValue !== undefined && item.isVisible()) {
				var value = item.getValue();
				if (value != null) {
					if (Ext.isArray(value)) {
						Ext.Array.each(value, function(el) {
							result[el.paramName] = el.paramValue;
						});
					} else {
						result[value.paramName] = value.paramValue;
					}
				}
			}
		}, this);
		return result;
	},

	/*
	 * Очистка панелей с параметрами отчета
	 */
	clear: function() {
		this.items.each(function(item) {
			item.hide();
		}, this);
	},

	childRender: function() {
		this.childsToRender--;
		if (this.childsToRender == 0) {
			this.fireEvent('reportLoaded');
		}
	}
});
