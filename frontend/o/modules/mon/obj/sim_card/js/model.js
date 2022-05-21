/**
 * @class O.mon.model.sim.Card
 * @extends O.model.Object
 */
C.define('O.mon.model.sim.Card', {
	extend: 'O.model.Object',
	model: 'Mon.Sim.Card'
});

C.define('Mon.Sim.Card', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
			{name: 'id', type: 'int'},
			{name: 'id_firm', type: 'int'},
			{name: 'id_client_firm', type: 'int'},
			{name: 'id_device_sensor', type: 'int'},
			{name: 'id_device_protocol', type: 'int'},
			{name: 'account_number', type: 'string'},
			{name: 'phone_number', type: 'string'},
			{name: 'tariff', type: 'string'},
			{name: 'imei_sim', type: 'string'},
			{name: 'imei_tracker', type: 'string'},
			{name: 'provider', type: 'int'},
			{name: 'connection_date', type: 'utcdate', dateFormat: 'c'},
			{name: 'creation_date', type: 'utcdate', dateFormat: 'c'},
			{name: 'settings_key', type: 'string'},
			{name: 'note', type: 'string'},
			{name: 'state', type: 'int', useNull: true},

			{name: 'x_company', type: 'object'}
		]
	}
});
