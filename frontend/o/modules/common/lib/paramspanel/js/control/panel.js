/**
 * @fileOverview Parameters panel
 *
 * @class O.comp.Params
 * @extends Ext.panel.Panel
 */
C.utils.inherit('O.comp.Params', {

/** Translatable fields */
	paramNoData: '-- No data --',
	paramNotSelected: '-- Not selected --',

/**
	* Properties names object
	* @type {Object.<string>}
	*/
	propNames: {
		'device': 'Device',
		'period_begin': 'Period start',
		'period_end': 'Period end'
	},

/**
	* Параметры для отображения.
	* Передаются в этот компонент ввиде массива JSON объектов, типа:
	* [{
	*   alias: 'dt1'
	*   type: 'date',
	*   value: null 
	* }, {
	*   alias: 'dt2',
	*   type: 'date',
	*   value: null 
	* }
	* @type Object[]
	*/
	params: null,

/**
	* @constructs
	*/
	initComponent: function() {
		this.callOverridden(arguments);
		this.grid = this.down('gridpanel');
		if (!this.grid) {
			console.error('Error: Params grid not found!');
		}
	},

/**
	* Returns an object, containing custom editors.
	* An object containing name/value pairs of custom editor type definitions
	* that allow the grid to support additional types of editable fields
	* @return {Object}
	*/
	getCustomEditors: function() {
		return {
			device: Ext.create('O.form.ModelField', {
				proxyId: 'mon_device'
			})
		};
	},

/**
	* Returns an object, containing custom property names.
	* An object containing custom property name/display name pairs.
	* If specified, the display name will be shown in the name column
	* instead of the property name.
	* @return {Object}
	*/
	getPropertyNames: function() {
		return this.propNames;
	},

/**
	* Returns an object, containing custom renderers.
	* An object containing name/value pairs of custom
	* renderer type definitions that allow the grid
	* to support custom rendering of fields
	* @return {Object}
	*/
	getCustomRenderers: function() {
		var me = this; 
		var modelFn = function(model, val) {
			var list = C.get(model + 's');
			if (!list) {
				return me.paramNoData;
			}
			var obj = list.getByKey(val);
			if (obj) {
				return obj.getName();
			} else {
				return me.paramNotSelected;
			}
		};
		return {
			period_begin: function(v) {
				return Ext.Date.format(v, 'd.m.Y');
			},
			period_end: function(v) {
				return Ext.Date.format(v, 'd.m.Y');
			},
			device: function(v) { return modelFn('device', v); }
		};
	},

/**
	* Функция получения редактора по типу параметра
	* @param {String} type Тип параметра
	* @return {Object}
	* @protected
	*/
	getParamData: function(param) {
		switch (param.type) {
			case 'string': return '';
			case 'float':  return 0.0;
			case 'datetime':
			case 'date':   return new Date();
			case 'bool':   return false;
			default: return 0;
		}
	},

	/*
	getParamRenderer: function(param) {
		switch (param.type) {
			case 'datetime': return function(val) {
				return val.dateFormat('d.m.Y H:i');
			};
			case 'device':
			case 'group':
			case 'report':
			case 'user': return function(val) {
				var list = C.get(param.type + 's');
				if (!list) {
					return this.paramNoData;
				}
				var obj = list.get(val);
				if (Ext.isEmpty(obj)) {
					return this.paramNotSelected;
				} else {
					return obj.getName();
				}
			}
		}
	},

	getParamEditor: function(param) {
		switch (param.type) {
			case 'datetime':
				return new Ext.grid.GridEditor(new Ext.ux.form.DateTime({
					dateFormat: 'd.m.Y',
					timeFormat: 'H:i',
					timeWidth: 55
				}));
			case 'device':
				return new Ext.grid.GridEditor(new O.form.ModelField({
					proxyId: param.type + 's'}));
		}
		return;
	},*/

/**
	* Создание грида параметров на основе переданного массива
	* параметров {@link params}
	* @param {Object[]} params
	*/
	rebuild: function(params) {
		var data = {};
		Ext.each(params, function(param) {
			data[param.alias] = this.getParamData(param);
		}, this);
		if (!Ext.isEmpty(data)) {
			this.grid.setSource(data);
		}
	},

/**
	* Возвращает значения параметров
	* @return {Object[]}
	*/
	getValues: function() {
		var values = this.grid.getSource();
		// fix strange behavior of propgrid.getSource() method
		for (var key in values) {
			var wrongKey = /Ext\.grid\.property\.Property-/gi;
			if (key.match(wrongKey)) {
				var realKey = key.replace(wrongKey, '');
				values[realKey] = values[key];
				delete values[key];
			}
		}
		return values;
	}
});