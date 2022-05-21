/**
 * Devices class
 * @class O.mon.model.device.Condition
 * @extends O.mon.model.Device
 */
C.define('O.mon.model.device.Condition', {
	extend: 'O.mon.model.Device',
	model: 'Mon.device.Condition'
});

C.define('Mon.device.Condition', {
	extend: 'Mon.Device',
	config: {
		fields: [
			{name: 'error', convert: function(v, rec){
				var seed = md5('error' + rec.get('id'));
				var count = Math.max(0, Math.ceil((parseInt(seed[0] + seed[1], 16) - 231) / 4));
				var errors = [];
				for (var i = 0; i < count; i++) {
					errors.push({
						critical: !(parseInt(seed[2 + i], 16) % 4)
					});
				}
				return errors;
			}},
			{name: 'error_count', type: 'string', convert: function(v, rec){
				return rec.get('error').length;
			}},
			{name: 'prev_mro', type: 'utcDate', dateFormat: 'c',
				convert: function(v, rec){
					var seed = md5('error' + rec.get('id'));
					var diff = parseInt(seed[11] + seed[12], 16) + 15;
					return Ext.Date.add(new Date('2013-04-24'),
						Ext.Date.DAY, -1 * diff);
				}},
			{name: 'next_mro', type: 'utcDate', dateFormat: 'c',
				convert: function(v, rec){
					var seed = md5('error' + rec.get('id'));
					var diff = parseInt(seed[13] + seed[14], 16) + 15;
					return Ext.Date.add(new Date('2013-04-24'),
						Ext.Date.DAY, diff);
				}}
		]
	}
});