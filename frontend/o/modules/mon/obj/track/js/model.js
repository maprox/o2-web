/**
 * Monitoring track model object
 * @class O.mon.model.Track
 * @extends O.model.Object
 */
C.define('O.mon.model.Track', {
	extend: 'O.model.Object'
});

C.define('Mon.Track', {
	extend: 'Ext.data.Model',

	/**
	 * @param {O.mon.model.Packet[]}
	 * Track packets
	 */
	packets: [],
	/**
	 * @param {Boolean}
	 * Is packets loaded
	 */
	packetsLoaded: false,

	statics: {
		_NO_DATA: 'nodata',
		_SLEEP: 'sleep',
		_MOVING: 'moving'
	},

	config: {
		fields: [
			{name: 'id', type: 'int'},
			{name: 'id_device', type: 'int'},
			{name: 'type', type: 'string'},
			{name: 'sdt', type: 'utcDate', dateFormat: 'c'},
			{name: 'edt', type: 'utcDate', dateFormat: 'c'},
			{name: 'odometer', type: 'float'},
			{name: 'actual_odometer', type: 'float'},
			{name: 'speed_max', type: 'float'},
			{name: 'speed_average', type: 'float'},
			{name: 'track'}, // list of all packets
			{name: 'state', type: 'int'},
			{name: 'start_point'},
			{name: 'color', type: 'string', convert: function(value, record){
				var colorIndex = record.get('id') % C.cfg.track.colors.length;
				return C.cfg.track.colors[colorIndex];
			}}
		]
	},

	/**
	 * Performs packets load
	 * @param {Function} successFn
	 * @param {Function} failureFn
	 * @param {Object} scope
	 */
	getPackets: function(successFn, failureFn, scope) {
		var filter = 'time ge ' + C.utils.fmtUtcDate(this.get('sdt')) +
			' and time le ' + C.utils.fmtUtcDate(this.get('edt')) +
			' and id_device eq ' + this.get('id_device');
		if (this.isMoving()) {
			filter = filter + ' and state ne 4';
		}
		C.get('mon_packet', function(response, success) {
			if (!success) {
				failureFn.call(scope, response);
				return;
			}

			this.packetsLoaded = true;
			// Kill reference to prototype property!
			this.packets = [];
			response.sort('time');
			response.each(function(item) {
				var packet = Ext.create('O.mon.model.Packet', item);
				packet.fetchDevice();
				this.packets.push(packet);
			}, this);
			successFn.call(scope, response);
		}, this, {'$filter': filter, '$nolimit': 1});
	},

	/**
	 * Returns track duration in seconds
	 * @return {Integer}
	 */
	getTime: function() {
		var seconds = (this.get('edt') - this.get('sdt'))/1000;
		return Math.round(seconds);
	},

	/**
	 * Returns if track is stopping
	 * @return {Boolean}
	 */
	isSleep: function() {
		return this.get('type') == Mon.Track._SLEEP;
	},

	/**
	 * Returns if track is moving
	 * @return {Boolean}
	 */
	isMoving: function() {
		return this.get('type') == Mon.Track._MOVING;
	}
});
