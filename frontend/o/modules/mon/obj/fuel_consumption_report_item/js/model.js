/**
 * @class O.mon.model.fuel.consumption.report.Item
 * @extends O.model.Object
 */
C.define('O.mon.model.fuel.consumption.report.Item', {
	extend: 'O.model.Object',
	model: 'Mon.Fuel.Consumption.Report.Item'
});

C.define('Mon.Fuel.Consumption.Report.Item', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
			{name: 'id', type: 'int'},
			{name: 'id_fuel_consumption_report', type: 'int'},
			{name: 'num', type: 'int'},
			{name: 'id_vehicle', type: 'int'},
			{name: 'id_responsible_person', type: 'int'},
			{name: 'consumption_rate', type: 'float'},
			{name: 'consumption_limit', type: 'float'},
			{name: 'mileage_waylist', type: 'float'},
			{name: 'mileage_track', type: 'float'},
			{name: 'consumption_by_norm', type: 'float'},
			{name: 'consumption_fact', type: 'float'},
			{name: 'previous_month_remainder', type: 'float'},
			{name: 'received', type: 'float'},
			{name: 'next_month_remainder', type: 'float'},
			{name: 'overrun', type: 'float'},
			{name: 'state', type: 'int', useNull: true},
			// Joined fields
			{name: 'id_vehicle$car_model', persist: false, type: 'string'},
			{name: 'id_vehicle$license_number', persist: false, type: 'string'}
		]
	}
});
