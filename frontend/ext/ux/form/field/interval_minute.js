/**
 * @class Ext.ux.form.field.IntervalMinute
 * @extends Ext.form.field.ComboBox
 */
Ext.define('Ext.ux.form.field.IntervalMinute', {
	extend: 'Ext.form.field.ComboBox',
	alias: ['widget.minterval', 'widget.mintervalfield'],

/**
	* Intervals list to fill combobox
	*/
	intervals: [
		'00:05',
		'00:10',
		'00:15',
		'00:20',
		'00:30',
		'00:45',
		'01:00',
		'01:30',
		'02:00',
		'02:30',
		'03:00',
		'03:30',
		'04:00',
		'05:00',
		'06:00',
		'07:00',
		'08:00',
		'09:00',
		'12:00',
		'24:00'
	],

	queryMode: 'local',

	regex: /^\d+:(([0-5][0-9])|([0-9]))$/,

/**
	* Component initialization
	*/
	initComponent: function() {
			this.store = Ext.create('Ext.data.Store', {
				fields: ['minutes', 'time']
			});

			for (var i = 0; i < this.intervals.length; i++) {
				var interval = this.intervals[i];
				this.store.add({
					'minutes': this.timeToMinutes(interval),
					'time': interval
				});
			}

			this.valueField = 'minutes';
			this.displayField = 'time';
			this.callParent(arguments);
	},

/**
	* Converts time in H:i format to minutes
	* @param {String} time
	* @return {Number}
	*/
	timeToMinutes: function(time) {
		if (!time) return null;
		time = time.split(':');
		return (parseInt(time[0], 10) * 60) + parseInt(time[1], 10);
	},

/**
	* Returns value for submit
	* @return {Number}
	*/
	getSubmitValue: function() {
		if (!Ext.isNumber(this.getValue())) {
			return this.timeToMinutes(this.getValue());
		}
		return this.getValue();
	}
});