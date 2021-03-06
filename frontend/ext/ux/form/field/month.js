/**
 * @class Ext.ux.form.field.Month
 * @extends Ext.form.field.Date
 * http://ext4all.com/post/ext4-monthfield-with-month-picker-for-extjs4
 */
Ext.define('Ext.ux.form.field.Month', {
	extend: 'Ext.form.field.Date',
	alias: 'widget.monthfield',
	requires: ['Ext.picker.Month'],
	alternateClassName: ['Ext.form.MonthField', 'Ext.form.Month'],
	selectMonth: null,
	createPicker: function () {
		var me = this,
			format = Ext.String.format;
		return Ext.create('Ext.picker.Month', {
			pickerField: me,
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
			showToday: me.showToday,
			startDay: me.startDay,
			minText: format(me.minText, me.formatDate(me.minValue)),
			maxText: format(me.maxText, me.formatDate(me.maxValue)),
			listeners: {
				select: { scope: me, fn: me.onSelect },
				monthdblclick: { scope: me, fn: me.onOKClick },
				yeardblclick: { scope: me, fn: me.onOKClick },
				OkClick: { scope: me, fn: me.onOKClick },
				CancelClick: { scope: me, fn: me.onCancelClick }
			},
			keyNavConfig: {
				esc: function () {
					me.collapse();
				}
			}
		});
	},
/*	beforeBlur : function() {
		var me = this,
			v = me.selectMonth,
			focusTask = me.focusTask;

		if (focusTask) {
			focusTask.cancel();
		}

		if (v) {
			me.setValue(v);
		}
	},
	getSubmitValue: function() {
		var format = this.submitFormat || this.format,
			value = this.getValue();

		return value ? Ext.Date.format(value, format) : '';
	},*/

	/*parseDate : function(value) {
		var me = this;

		if (!value || Ext.isDate(value)) {
			return value;
		}

		//if (me.selectMonth) {
		//	return me.selectMonth;
		//}

		var me = this,
			val = me.safeParse(value, me.format),
			altFormats = me.altFormats,
			altFormatsArray = me.altFormatsArray,
			i = 0,
			len;

		if (!val && altFormats) {
			altFormatsArray = altFormatsArray || altFormats.split('|');
			len = altFormatsArray.length;
			for (; i < len && !val; ++i) {
				val = me.safeParse(value, altFormatsArray[i]);
			}
		}
		return val;
	},*/
	safeParse : function(value, format) {
		var me = this,
			utilDate = Ext.Date,
			result = null,
			strict = me.useStrict,
			parsedDate;

		if (utilDate.formatContainsHourInfo(format)) {

			result = utilDate.parse(value, format, strict);
		} else {

			parsedDate = utilDate.parse(
				'01 ' + value + ' ' + me.initTime,
				'd ' + format + ' ' + me.initTimeFormat,
				strict
			);
			if (parsedDate) {
				result = utilDate.clearTime(parsedDate);
			}
		}
		return result;
	},

	onCancelClick: function () {
		var me = this;
		me.selectMonth = null;
		me.collapse();
	},
	onOKClick: function () {
		var me = this;
		if (me.selectMonth) {
			me.setValue(me.selectMonth);
			me.fireEvent('select', me, me.selectMonth);
		} else {
			me.setValue(new Date());
		}
		me.collapse();
	},
	onSelect: function (m, d) {
		var me = this;
		me.selectMonth = new Date((d[0] + 1) + '/1/' + d[1]);
	}
});
