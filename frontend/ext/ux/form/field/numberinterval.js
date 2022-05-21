/**
 * Creates numberfields for specify interval
 * @constructor
 * @param {Object} config A config object
 */
Ext.define('Ext.ux.form.field.NumberInterval', {
	extend:'Ext.form.FieldContainer',
	mixins: {
		field: 'Ext.form.field.Field'
	},
	alias: 'widget.numberinterval',
	layout: 'hbox',
	combineErrors: true,
	msgTarget: 'side',

	dayCfg: {},
	hourCfg: {},
	minuteCfg: {},

	initComponent: function() {
		this.buildField();
		this.callParent(arguments);
		this.dayField = this.down('#dayField');
		this.hourField = this.down('#hourField');
		this.minuteField = this.down('#minuteField');

		this.dayField.on('change', this.onChange, this);
		this.hourField.on('change', this.onChange, this);
		this.minuteField.on('change', this.onChange, this);

		this.initField();
	},

	onChange: function() {
		this.fireEvent('change');
	},

	// @private
	buildField: function() {
		this.items = [
			Ext.apply({
				xtype: 'numberfield',
				itemId: 'dayField',
				fieldLabel: _('Days') + ':',
				minValue: 0,
				allowDecimals: false,
				width: 180
			}, this.dayCfg),
			{
				xtype: 'tbspacer', width: 10
			},
			Ext.apply({
				xtype: 'numberfield',
				itemId: 'hourField',
				fieldLabel: _('Hours') + ':',
				minValue: 0,
				allowDecimals: false,
				width: 180
			}, this.hourCfg),
			{
				xtype: 'tbspacer', width: 10
			},
			Ext.apply({
				xtype: 'numberfield',
				itemId: 'minuteField',
				fieldLabel: _('Minutes') + ':',
				minValue: 0,
				allowDecimals: false,
				width: 180
			}, this.minuteCfg)
		]
	},

	getValue: function() {
		var value = null;
		var day = this.dayField.getSubmitValue();
		var hour = this.hourField.getSubmitValue();
		var minute = this.minuteField.getSubmitValue();
		if (!day) {
			day = 0;
		}
		if (!hour) {
			hour = 0;
		}
		if (!minute) {
			minute = 0;
		}

		return (day * 24 * 60 * 60) + (hour * 60 * 60) + (minute * 60);
	},

	setValue: function(value) {
		if (!value) {
			value = 0;
		}

		value = +value;

		var day = 24 * 60 * 60;
		var hour = 60 * 60;
		var minute = 60;

		var days = ~~(value / day);
		var hours = ~~((value - (days * day)) / hour);
		var minutes = ~~((value - (days * day) - (hours * hour)) / minute);

		this.dayField.setRawValue(days);
		this.hourField.setRawValue(hours);
		this.minuteField.setRawValue(minutes);
	},

	/**
	 * Resets the original value
	 */
	resetOriginalValue: function() {
		this.mixins.field.resetOriginalValue.apply(this, arguments);
		this.dayField.resetOriginalValue();
		this.hourField.resetOriginalValue();
		this.minuteField.resetOriginalValue();
	}
});