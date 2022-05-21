/**
 * @class O.mon.act.condition.Info
 * @extends Ext.panel.Panel
 */
C.utils.inherit('O.mon.act.condition.Info', {

	loadRecord: function(record) {
		this.name.setTitle(record.get('name'));
		this.state.getStore().loadData(this.prepareStateData(record));
		this.error.getStore().loadData(this.prepareErrorData(record));
	},

	prepareStateData: function(record) {
		var ret = [];
		var pushState = function(name, value) {
			ret.push({name: name, value: value});
		};

		var seed = md5('state' + record.get('id'));

		pushState(_('Engine rounds'), Math.floor(parseInt(seed[0] + seed[1] + seed[2], 16) * 8000 / Math.pow(16, 3))
			+ ' ' + _('rpm'));
		pushState(_('Engine load'), Math.floor(parseInt(seed[3] + seed[4], 16) * 200 / Math.pow(16, 2))
			+ ' ' + _('horse power'));
		pushState(_('Freezer temperature'), Math.floor(parseInt(seed[5] + seed[6], 16) * 150 / Math.pow(16, 2))
			+ ' ' + _('°C'));
		pushState(_('Fuel system condition'), Math.floor(parseInt(seed[7] + seed[8] + seed[9], 16) * 500 / Math.pow(16, 3))
			+ ' ' + _('kPa'));
		pushState(_('Vehicle speed'), Math.floor(parseInt(seed[10] + seed[11], 16) * 250 / Math.pow(16, 2))
			+ ' ' + _('km/h'));
		pushState(_('Short-term fuel consumption'), Math.floor(parseInt(seed[12] + seed[13], 16) * 100 / Math.pow(16, 2))
			+ ' ' + _('l/h'));
		pushState(_('Long-term fuel consumption'), Math.floor(parseInt(seed[14] + seed[15], 16) * 100 / Math.pow(16, 2))
			+ ' ' + _('l/h'));

		seed = md5('state2' + record.get('id'));

	//	pushState(_('Absolute air pressure'), Math.floor(parseInt(seed[0] + seed[1], 16) * 100 / Math.pow(16, 2)));
		pushState(_('Ignition overhead'), Math.floor(parseInt(seed[0] + seed[1], 16) * 100 / Math.pow(16, 2))
			+ '°');
		pushState(_('Suction air temperature'), Math.floor(parseInt(seed[2] + seed[3], 16) * 100 / Math.pow(16, 2))
			+ ' ' + _('°C'));
		pushState(_('Mass air expension'), Math.floor(parseInt(seed[4] + seed[5] + seed[6], 16) * 500 / Math.pow(16, 3))
			+ ' ' + _('k/h'));
		pushState(_('Throttle position'), Math.floor(parseInt(seed[7] + seed[8], 16) * 100 / Math.pow(16, 2))
			+ '%');
		pushState(_('Oxygen sensor'), Math.floor(parseInt(seed[9], 16) / 2)
			+ ' ' + _('volt'));
		pushState(_('Fuel pressure'), Math.floor(parseInt(seed[10] + seed[11] + seed[12], 16) * 500 / Math.pow(16, 3))
			+ ' ' + _('kPa'));
	//	pushState(_('Graph building'), 111);
	//	pushState(_('VIN number readings'), 111);
		pushState(_('100 km/h acceleration time'), (parseInt(seed[13], 16) + 8)
			+ ' ' + _('s'));

		return ret;
	},

	prepareErrorData: function(record) {
		var codes = ['P0100', 'P0101', 'P0102', 'P0103', 'P0105', 'P0106',
			'P0107', 'P0108', 'P0110', 'P0111', 'P0112', 'P0113', 'P0115',
			'P0116', 'P0118', 'P0120', 'P0121', 'P0122', 'P0123', 'P0125'],
			count = record.get('error_count'),
			newCodes = [],
			ret = [],
			seed = md5('error' + record.get('id'));

		for (var i = 0; i < count; i++) {
			var index = Math.floor(parseInt(seed[i] + seed[i + 8], 16) * codes.length / 256);
			ret.push({code: codes[index]});
			newCodes = [];
			if (codes.slice(0, index)) {
				newCodes = newCodes.concat(codes.slice(0, index));
			}
			if (codes.slice(index + 1)) {
				newCodes = newCodes.concat(codes.slice(index + 1));
			}
			codes = newCodes;
		}

		return ret;
	}
});


