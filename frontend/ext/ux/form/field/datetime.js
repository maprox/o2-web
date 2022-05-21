/**
 * Creates new DateTime
 * @constructor
 * @param {Object} config A config object
 */
Ext.define('Ext.ux.form.field.DateTime', {
	extend:'Ext.form.FieldContainer',
	mixins: {
		field: 'Ext.form.field.Field'
	},
	alias: 'widget.datetime',
	layout: 'hbox',
	combineErrors: true,
	utcConvert: true,
	msgTarget: 'side',

	dateCfg: {},
	timeCfg: {},

	initComponent: function() {
		this.buildField();
		this.callParent(arguments);
		this.dateField = this.down('datefield');
		this.timeField = this.down('timefield');
		this.initField();
	},

	// @private
	buildField: function() {
		this.items = [
			Ext.apply({
				xtype: 'datefield',
				format: O.format.Date,
				width: 90
			}, this.dateCfg), {
				xtype: 'tbspacer', width: 2
			},
			Ext.apply({
				xtype: 'timefield',
				format: O.format.TimeShort,
				width: 60
			}, this.timeCfg)
		]
	},

	getValue: function() {
		var value = null;
		var date = this.dateField.getSubmitValue();
		var time = this.timeField.getSubmitValue();
		if (date) {
			if (time) {
				value = Ext.Date.parse(date + ' ' + time, this.getFormat());
			} else {
				value = this.dateField.getValue();
			}
		}
		return value ? C.utils.fmtUtcDate(value) : value;
	},

	setValue: function(value) {
		var rawvalue = value;
		if (rawvalue && this.utcConvert) {
			var utcval = C.getSetting('p.utc_value');
			if (!rawvalue.pg_utc) {
				rawvalue = Ext.Date.parse(rawvalue, 'c');
			}
			rawvalue = rawvalue.pg_utc(utcval);
		}
		this.dateField.setValue(rawvalue);
		this.timeField.setValue(rawvalue);
	},

	/**
	 * Resets the original value
	 */
	resetOriginalValue: function() {
		this.mixins.field.resetOriginalValue.apply(this, arguments);
		this.dateField.resetOriginalValue();
		this.timeField.resetOriginalValue();
	},

/*
	getModelData: function() {
		var data = this.mixins.field.getModelData.apply(this, arguments);
		if (!C.utils.isEmptyObject(data) && this.utcConvert) {
			//value = value.pg_utc(C.getSetting('p.utc_value'), true);
			var name = this.getName();
			var val = data[name];
			data[name] = C.utils.fmtUtcDate(val);
		}
		console.log('getModelData', data);
		return data;
	},

	getSubmitData: function() {
		var value = this.getValue();
		var format = this.getFormat();
		if (value && this.utcConvert) {
			//value = value.pg_utc(C.getSetting('p.utc_value'), true);
			value = C.utils.fmtUtcDate(value);
			console.log(1);
		}
		console.log('getSubmitData', value);
		return value ? Ext.Date.format(value, format) : null;
	},*/

	getFormat: function() {
		return (this.dateField.submitFormat || this.dateField.format) +
			" " + (this.timeField.submitFormat || this.timeField.format);
	}
});