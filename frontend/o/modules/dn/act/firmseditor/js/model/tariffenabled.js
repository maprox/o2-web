C.define('FirmTariffEnabled', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
			{name: 'id', type: 'int'},
			{name: 'name', type: 'string'},
			{name: 'enabled', type: 'bool'},
			{name: 'individual', type: 'bool'}
		]
	}
});
