/**
 * @class O.mon.model.WaylistRoute
 * @extends O.model.Object
 */
C.define('O.mon.model.WaylistRoute', {
	extend: 'O.model.Object',
	model: 'Mon.WaylistRoute'
});

C.define('Mon.WaylistRoute', {
	extend: 'Ext.data.Model',

	waylist: null,

	config: {
		fields: [
			{name: 'id', type: 'int'},
			{name: 'id_waylist', type: 'int'},
			{name: 'expect_dt', type: 'utcdate', dateFormat: 'c'},
			{name: 'enter_dt', type: 'utcdate', dateFormat: 'c'},
			{name: 'exit_dt', type: 'utcdate', dateFormat: 'c'},
			{name: 'num', type: 'int', useNull: true},
			{name: 'id_company_disposal', type: 'int', useNull: true,
				reference: 'x_company'},
			{name: 'id_point', type: 'int', useNull: true,
				reference: 'mon_geofence'},
			{name: 'time_way', type: 'string'},
			{name: 'time_stay', type: 'string'},
			{name: 'time_stay_fact', type: 'string', convert: function(v, rec){
				if (!rec.get('exit_dt') || !rec.get('enter_dt')) {
					return '';
				}
				var dt = new Date(rec.get('exit_dt') - rec.get('enter_dt'));
				dt = dt.pg_utc(C.getSetting('p.utc_value'), true);
				return C.utils.fmtDate(dt, O.format.TimeShort);
			}},
			{name: 'actual_distance', type: 'float', useNull: true},
			{name: 'actual_distance_km', type: 'float', useNull: true,
				convert: function(v, rec) {
					return v || rec.get('actual_distance') / 1000;
				}},
			{name: 'distance', type: 'float', useNull: true},
			{name: 'distance_km', type: 'float', useNull: true,
				convert: function(v, rec) {
					return v || rec.get('distance') / 1000;
				}},
			{name: 'state', type: 'int', useNull: true},
			// joined fields
			{name: 'id_point$name', type: 'string'},
			{name: 'id_point$center_lat', type: 'string'},
			{name: 'id_point$center_lon', type: 'string'},
			{name: 'id_point$address', type: 'string'}
		]
	},

	/**
	 * Returns whether device have cleared this point
	 * @return {Boolean}
	 */
	isCleared: function() {
		return this.get('enter_dt') != null;
	},

	/**
	 * Returns whether device have cleared late or is being late to this point
	 * @return {Boolean}
	 */
	isLate: function() {
		return this.lateBy() > 0;
	},

	/**
	 * Returns amount of seconds the device is being late by now
 	 */
	lateBy: function() {
		if (this.get('expect_dt') == null) {
			return 0;
		}

		$enterDt = this.isCleared() ? this.get('enter_dt') : new Date();
		return Math.max($enterDt - this.get('expect_dt'), 0);
	}
});
