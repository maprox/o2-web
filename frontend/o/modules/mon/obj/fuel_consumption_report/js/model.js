/**
 * @class O.mon.model.Waylist
 * @extends O.model.Object
 */
C.define('O.mon.model.fuel.consumption.Report', {
	extend: 'O.model.Object',
	model: 'Mon.Fuel.Consumption.Report'
});

C.define('Mon.Fuel.Consumption.Report', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
			{name: 'id', type: 'int'},
			{name: 'id_firm', type: 'int'},
			{name: 'dt', type: 'date', dateFormat: 'c'},
			{name: 'id_division', type: 'int', useNull: true},
			{name: 'state', type: 'int', useNull: true},
			{name: 'status', type: 'int', useNull: true},
			// Joined fields
			{name: 'id_division$name', persist: false, type: 'string'}
		]
	}
});
