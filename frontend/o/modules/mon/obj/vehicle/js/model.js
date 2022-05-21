/**
 * @class O.dn.model.Worker
 * @extends O.x.model.Person
 */
C.define('O.mon.model.Vehicle', {
	extend: 'O.model.Object',
	model: 'Mon.Vehicle'
});

C.define('Mon.Vehicle', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
			{name: 'id', type: 'int'},
			{name: 'id_firm', type: 'int'},
			{name: 'name', type: 'string'},
			{name: 'id_fuel', type: 'int', useNull: true, reference: 'mon_fuel'},
			{name: 'license_number', type: 'string'},
			{name: 'garage_number', type: 'string'},
			{name: 'fuel_expense', type: 'float', useNull: true},
			{name: 'bus_license_type', type: 'int', useNull: true},
			{name: 'bus_license_reg_num', type: 'string'},
			{name: 'bus_license_series', type: 'string'},
			{name: 'bus_license_number', type: 'string'},
			{name: 'id_device', type: 'int'},
			{name: 'id_driver', type: 'int', useNull: true},
			{name: 'dt_production', type: 'date', dateFormat: 'c'},
			{name: 'state', type: 'int', useNull: true},
			// local fields
			{name: 'fullname', persist: false,
				convert: function(v, rec) {
					var num = rec.get('license_number');
					return rec.get('name') +
						(num ? ' # ' + rec.get('license_number') : '');
				}
			},
			{name: 'vin', type: 'string'},
			{name: 'car_model', type: 'string'},
			{name: 'car_type', type: 'string'},
			{name: 'category', type: 'int'},
			{name: 'engine', type: 'string'},
			{name: 'frame', type: 'string'},
			{name: 'body', type: 'string'},
			{name: 'body_color', type: 'string'},
			{name: 'engine_power', type: 'int', useNull: true},
			{name: 'engine_power_measure', type: 'int', useNull: true},
			{name: 'engine_displacement', type: 'int', useNull: true},
			{name: 'engine_type', type: 'string'},
			{name: 'max_mass', type: 'int', useNull: true},
			{name: 'unladen_mass', type: 'int', useNull: true},
			{name: 'id_division', type: 'int', useNull: false,
				reference: 'dn_division'},
			{name: 'id_responsible', type: 'int', useNull: true},

			// linked
			{name: 'attachments', type: 'object'}
		]
	}
});
