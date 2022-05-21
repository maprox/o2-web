/**
 *
 * DateTimeField
 * Based on the Ext.ux.form.DateTimeField by wzl002
 * @see http://www.sencha.com/forum/showthread.php?137242-Ext.ux.DateTimeField-DateTimePicker-for-ext4-also-DateTimeMenu-TimePickerField
 * @class O.lib.DateTimeField
 * @extends Ext.form.field.Date
 */
C.define('O.lib.DateTimeField', {
	extend: 'Ext.Toolbar',
	alias: 'widget.datetimefield',

/**
	* @property {Boolean} isFormField
	* Flag denoting that this component is a Field. Always true.
	*/
	isFormField: true,

/**
	* constructor
	*/
	initComponent: function() {
		if (!this.value) {
			this.value = new Date();
		}
		Ext.apply(this, {
			//width: 185,
			layout: 'hbox',
			// Делаем два поля ввода
			items: [{
				itemId: 'datebox',
				xtype: 'datefield',
				width: 100,
				editable: false,
				format: this.dateFormat,
				createPicker: this.createPicker,
				markInvalid: this.markInvalid,
				listeners: {
					change: this.applyValue,
					scope: this
				}
			}, {
				itemId: 'timebox',
				xtype: 'timefield',
				format: this.timeFormat,
				editable: false,
				width: 75,
				markInvalid: this.markInvalid,
				listeners: {
					change: this.applyValue,
					scope: this
				}
			}]
		});
		this.callParent(arguments);
		this.format = this.dateFormat + ' ' + this.timeFormat;
		this.timeBox = this.getComponent('timebox');
		this.dateBox = this.getComponent('datebox');
		this.setValue(this.value);
		this.addEvents('change');
		this.on('afterrender', this.onAfterRender, this);
	},

/**
	* Установка минимального и максимального значений в пикерах даты
	*/
	setMinMaxValue: function() {
		if (this.endDateField && this.endDateField.getValue()) {
			this.dateBox.setMaxValue(this.endDateField.getValue().clone());
		}
		if (this.startDateField && this.startDateField.getValue()) {
			this.dateBox.setMinValue(this.startDateField.getValue().clone());
		}
	},

/**
	* Подключение обработчиков событий
	*/
	onAfterRender: function() {
		this.setMinMaxValue();
		if (this.endDateField) {
			this.endDateField.on('change', function(){
				this.dateBox.setMaxValue(
					this.endDateField.getValue().clone());
				this.validate();
			}, this);
		}
		if (this.startDateField) {
			this.startDateField.on('change', function(){
				this.dateBox.setMinValue(
					this.startDateField.getValue().clone());
				this.validate();
			}, this);
		}
	},

/**
	* Установка заданного значения в пикеры
	*/
	applyValue: function() {
		var time = this.timeBox.getValue();
		this.value = this.dateBox.getValue();
		if (!Ext.isDate(time) || !this.value) { return; }
		this.value.setMinutes(time.getMinutes());
		this.value.setHours(time.getHours());
		this.validate();
		this.fireEvent('change', this, this.value);
	},

/**
	* Resets the field's originalValue property so it matches the current value
	*/
	resetOriginalValue: function() {
		this.dateBox.resetOriginalValue();
		this.timeBox.resetOriginalValue();
	},

/**
	* Is dirty
	*/
	isDirty: function() {
		return (this.dateBox.isDirty() || this.timeBox.isDirty());
	},

/**
	* Get name
	*/
	getName: function() {
		return this.name;
	},

/**
	* Reset
	*/
	reset: function() {
		this.dateBox.reset();
		this.timeBox.reset();
	},

/**
	* Возвращает выбранное значение
	*/
	getValue: function() {
		return this.value;
	},

/**
	* Устанавливает значение
	*/
	setValue: function(value) {
		this.dateBox.setValue(value);
		this.timeBox.setValue(value);
		this.value = value;
	},

	valueToRaw: function(value) {
		return value;
	},

	setRawValue: function(value) {
		this.setValue(value);
	},

	getRawValue: function (b) {
		return this.value;
	},

/**
	* Помечает поле как некорректно заполненное
	*/
	markInvalid: function(message) {
		var b = this;
		if(b.inputEl) {
			b.inputEl["addCls"](b.invalidCls + "-field");
		}
		b.activeError = message;
		b.mixins.labelable.renderActiveError.call(b);
		b.doComponentLayout();
	},

/**
	* Проверка валидности введенных данных
	*/
	validate: function() {
		var valid = true;
		var invalidText = '';
		if (this.endDateField) {
			var endDate = this.endDateField.getValue();
			if (endDate - this.value < 0) {
				valid = false;
				invalidText = Ext.String.format(this.dateBox.maxText,
					this.endDateField.dateBox.getRawValue() + ' ' +
					this.endDateField.timeBox.getRawValue());
			}
		}
		if (this.startDateField) {
			var startDate = this.startDateField.getValue();
			if (this.value - startDate < 0) {
				valid = false;
				invalidText = Ext.String.format(this.dateBox.minText,
					this.startDateField.dateBox.getRawValue() + ' ' +
					this.startDateField.timeBox.getRawValue());
			}
		}
		if (!valid) {
			this.dateBox.markInvalid(invalidText);
		}
		else {
			this.dateBox.clearInvalid();
		}
		return valid;
	},

/**
	* Checks if value is valid
	* @return {Boolean}
	*/
	isValid: function () {
		return this.validate();
	},

/**
	* Создание пикера для ввода даты
	*/
	createPicker: function() {
		var me = this, format = Ext.String.format;
		return Ext.widget('datepicker', {
			ownerCt: me.ownerCt,
			renderTo: document.body,
			floating: true,
			hidden: true,
			focusOnShow: true,
			minDate: me.minValue,
			maxDate: me.maxValue,
			disabledDatesRE: me.disabledDatesRE,
			disabledDatesText: me.disabledDatesText,
			disabledDays: me.disabledDays,
			disabledDaysText: me.disabledDaysText,
			format: me.format,
			timeFormat: O.format.TimeShort,
			dateFormat: O.format.Date,
			showToday: me.showToday,
			startDay: me.startDay,
			minText: format(me.minText, me.formatDate(me.minValue)),
			maxText: format(me.maxText, me.formatDate(me.maxValue)),
			listeners: {
				scope: me,
				select: me.onSelect
			},
			keyNavConfig: {
				esc: function() {
					me.collapse();
				}
			}
		});
	}
});
