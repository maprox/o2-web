/**
 * TimeSlider controller
 */
C.define('O.mon.trackhistory.TimeSlider', {
	extend: 'Ext.slider.Single',
	alias: 'widget.timeslider',

/**
	* Component initizalization
	*/
	initComponent: function() {

		// initialization
		this.configure({
			timeStart: this.timeStart,
			timeEnd: this.timeEnd,
			timeFormat: this.timeFormat
		});
		this.callParent(arguments);

		this.setValue(this.timeStart);
	},

	/**
	 * Configure widget
	 */
	configure: function(config) {
		var timePitch = config.timePitch || Ext.Date.SECOND;
		var timeFormat = config.timeFormat || 'd.m.Y H:i:s';
		Ext.apply(this, {
			minValue: 0,
			maxValue:
				this.getTimeDiff(config.timeStart, config.timeEnd, timePitch),
			tipText: function(thumb) {
				var dt = Ext.Date.add(config.timeStart, timePitch, thumb.value);
				var val = Ext.Date.format(dt, timeFormat);
				return Ext.String.format('{0}', val);
			}
		});

		this.timePitch = timePitch;
		this.timeFormat = timeFormat;
		this.timeStart = config.timeStart;
	},

/**
	* Returns difference in seconds between two dates
	* @param {Date} t1
	* @param {Date} t2
	* @param {String} diffType
	* @return {Number} timePitch
	*/
	getTimeDiff: function(t1, t2, timePitch) {
		var dif = t1.getTime() - t2.getTime();
		var secondsFromEndToStart = dif / 1000;
		var secondsBetweenDates = Math.abs(secondsFromEndToStart);
		var minutesBetweenDates = secondsBetweenDates / 60;
		if (timePitch === Ext.Date.MINUTE) {
			return minutesBetweenDates;
		} else {
			return secondsBetweenDates;
		}
	},

/**
	* Returns current time of slider
	*/
	getValue: function() {
		var value = this.callParent(arguments);
		return Ext.Date.add(this.timeStart, Ext.Date.SECOND, value);
	},

/**
	* Returns current time of slider
	*/
	setValue: function(value) {
		if (Ext.isDate(value)) {
			value = this.getTimeDiff(this.timeStart, value, this.timePitch);
		}
		return this.callParent(arguments);
	}
});