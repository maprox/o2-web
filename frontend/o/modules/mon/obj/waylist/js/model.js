/**
 * @class O.mon.model.Waylist
 * @extends O.model.Object
 */
C.define('O.mon.model.Waylist', {
	extend: 'O.model.Object',
	model: 'Mon.Waylist'
});

C.define('Mon.Waylist', {
	extend: 'Ext.data.Model',

	statics: {
		CREATED: 0,
		STARTED: 1,
		CLOSED: 2
	},

	config: {
		fields: [
			{name: 'id', type: 'int'},
			{name: 'id_firm', type: 'int'},
			{name: 'id_company_owner', type: 'int', useNull: true,
				reference: 'x_company'},
			{name: 'serial_num', type: 'string'},
			{name: 'num', type: 'int', useNull: true},
			{name: 'dt', type: 'date', dateFormat: 'c'},
			{name: 'sdt', type: 'date', dateFormat: 'c'},
			{name: 'edt', type: 'date', dateFormat: 'c'},
			{name: 's_point', type: 'int', useNull: true},
			{name: 'e_point', type: 'int', useNull: true},
			{name: 'distance', type: 'int', useNull: true},
			{name: 'distance_km', type: 'float', useNull: true,
				convert: function(v, rec) {
					return rec.get('distance') / 1000;
				}},
			{name: 'actual_distance', type: 'int', useNull: true},
			{name: 'actual_distance_km', type: 'float', useNull: true,
				convert: function(v, rec) {
					return rec.get('actual_distance') / 1000;
				}},
			{name: 'fuel_expense', type: 'float', useNull: true},
			{name: 'fuel', type: 'float', useNull: true,
				convert: function(v, rec) {
					if (!rec.get('distance_km') || !rec.get('fuel_expense')) {
						return null
					}
					return rec.get('distance_km') * rec.get('fuel_expense') / 100;
			}},
			{name: 'actual_fuel', type: 'float', useNull: true,
				convert: function(v, rec) {
					if (!rec.get('actual_distance_km') || !rec.get('fuel_expense')) {
						return null
					}
					return rec.get('actual_distance_km') * rec.get('fuel_expense') / 100;
			}},
			{name: 's_odometer', type: 'int', useNull: true},
			{name: 'e_odometer', type: 'int', useNull: true},
			{name: 's_odometer_km', type: 'float', useNull: true,
				convert: function(v, rec) {
					return rec.get('s_odometer') / 1000;
				}},
			{name: 'e_odometer_km', type: 'float', useNull: true,
				convert: function(v, rec) {
					return rec.get('e_odometer') / 1000;
				}},
			{name: 'id_vehicle', type: 'int', useNull: true,
				reference: 'mon_vehicle'},
			{name: 'id_trailer', type: 'int', useNull: true},
			{name: 'id_driver', type: 'int', useNull: true,
				reference: 'dn_worker'},
			{name: 'id_driver2', type: 'int', useNull: true,
				reference: 'dn_worker'},
			{name: 's_id_mechanic', type: 'int', useNull: true,
				reference: 'dn_worker'},
			{name: 's_id_dispatcher', type: 'int', useNull: true,
				reference: 'dn_worker'},
			{name: 'e_id_mechanic', type: 'int', useNull: true,
				reference: 'dn_worker'},
			{name: 'e_id_dispatcher', type: 'int', useNull: true,
				reference: 'dn_worker'},
			{name: 'refuel_list_number', type: 'string'},
			{name: 'refuel_amount', type: 'float', useNull: true},
			{name: 'id_fuel', type: 'int', useNull: true},
			{name: 's_fuel', type: 'float', useNull: true},
			{name: 'e_fuel', type: 'float', useNull: true},
			{name: 'fuel_norm', type: 'float', useNull: true},
			{name: 'fuel_fact', type: 'float', useNull: true},
			{name: 'medician', type: 'string'},
			{name: 'id_company_disposal', type: 'int', useNull: true,
				reference: 'x_company'},
			{name: 'id_point_submission', type: 'int', useNull: true,
				reference: 'mon_geofence'},
			{name: 'note', type: 'string'},
			{name: 'id_type', type: 'int', useNull: true,
				reference: 'mon_waylist_type'},
			{name: 'auto_close_fence', type: 'int', useNull: true},
			{name: 'status', type: 'int'},
			{name: 'state', type: 'int', useNull: true},
			{name: 'failed', type: 'boolean'},
			// joined fields
			{name: 'id_type$alias', persist: false, type: 'string'},
			{name: 'id_type$name', persist: false, type: 'string'},
			{name: 'id_type$id', persist: false, type: 'int'},
			{name: 'id_vehicle$name', persist: false, type: 'string'},
			{name: 'id_vehicle$car_model', persist: false, type: 'string'},
			{name: 'id_vehicle$license_number', persist: false, type: 'string'},
			{name: 'id_vehicle$id_device', persist: false, type: 'int',
				useNull: true},
			{name: 'id_driver$firstname', persist: false, type: 'string'},
			{name: 'id_driver$secondname', persist: false, type: 'string'},
			{name: 'id_driver$lastname', persist: false, type: 'string'},
			{name: 'id_driver$fullname', persist: false,
				convert: function(v, rec) {
					return rec.get('id_driver$lastname') + ' ' +
						rec.get('id_driver$firstname') + ' ' +
						rec.get('id_driver$secondname');
				},
				customSort: 'id_driver$lastname'
			}

		]
	}
});
