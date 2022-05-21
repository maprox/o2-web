C.define('O.mon.trackhistory.TrackModel', {
	extend: 'Mon.Track',
	fields: [
		// additional fields
		{name: 'visible', type: 'object', defaultValue: false},
		{name: 'date', type: 'string', convert: function(v, record) {
			var date = record.get('sdt');
			return Ext.Date.parse(
				Ext.Date.format(date, O.format.Date),
				O.format.Date);
		}},
		{name: 'odometer_string', type: 'string',
			convert: function(v, record) {
				var odometer = record.get('odometer');
				if (!odometer || record.isSleep()) {
					return '';
				}
				odometer = Number(odometer / 1000).toFixed(2);
				return Ext.String.format(_('odometerColumnTemplate'),
					odometer, record.get('type') == 'nodata' ? '~' : '');
			}},
		{name: 'speed_string', type: 'string',
			convert: function(v, record) {
				var max = record.get('speed_max'),
					average = record.get('speed_average');
				if ((!max && !average) || record.isSleep()) {
					return '';
				}
				return Ext.String.format(_('speedColumnTemplate'),
					C.utils.fmtSpeed(average.toFixed(1)),
					C.utils.fmtSpeed(max),
					record.get('type') == 'nodata' ? '~' : ''
				);
			}},
		{name: 'duration', type: 'date',
			convert: function(v, record) {
				return O.timeperiod.getDuration(record.getTime());
			}}
	]
});



