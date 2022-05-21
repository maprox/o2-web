/**
 * @class O.mon.model.device.command.Type
 * @extends O.model.Object
 */
C.define('O.mon.model.device.command.Type', {
	extend: 'O.model.Object',
	model: 'Mon.Device.Command.Type'
});

C.define('Mon.Device.Command.Type', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
			{name: 'id', type: 'int'},
			{name: 'name', type: 'string'},
			{name: 'description', type: 'string'},
			{name: 'state', type: 'int', useNull: true},
			{name: 'displayname', type: 'string',
				convert: function(value, record) {
					return _(record.get('description'));
				}
			},
			{name: 'protocols', type: 'object'},
			{name: 'params', type: 'object'},

			{name: 'transports', type: 'object'}
		]
	}
});
