/**
 * @class O.mon.model.device.Command
 * @extends O.model.Object
 */
C.define('O.mon.model.device.Command', {
	extend: 'O.model.Object',
	model: 'Mon.Device.Command'
});

C.define('Mon.Device.Command', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
			{name: 'id', type: 'int'},
			{name: 'id_device', type: 'int'},
			{name: 'id_command_type', type: 'int'},
			{name: 'id_transport', type: 'int'},
			{name: 'id_command_template', type: 'int'},
			{name: 'status', type: 'int'},
			{name: 'dt', type: 'utcdate', dateFormat: 'c'},
			{name: 'edt', type: 'utcdate', dateFormat: 'c'},
			{name: 'answer', type: 'string'},
			{name: 'state', type: 'int', useNull: true},

			{name: 'params', type: 'object'},
			{name: 'transport', type: 'object'},
			{name: 'command_type', type: 'object'},

			// Joined fields
			{name: 'template_name', type: 'string'},

			// Convert fields
			{name: 'transport_name', type: 'string',
				convert: function(value, record) {
					var transport = record.get('transport');
					if (transport && transport.name) {
						return transport.name.toUpperCase();
					}

					return _('Auto');
				}
			},

			{name: 'command_description', type: 'string',
				convert: function(value, record) {
					// If template used
					if (record.get('id_command_template')) {
						return record.get('template_name');
					}

					var commandType = record.get('command_type');
					if (commandType && commandType.description) {
						return _(commandType.description);
					}

					return '';
				}
			},

			{name: 'command_content', type: 'string',
				convert: function(value, record) {
					var content = '';

					// If template used
					if (record.get('id_command_template')) {
						return content;
					}

					var params = record.get('params');

					if (!params || !params.length) {
						return content;
					}

					Ext.Array.each(params, function(param) {

						if (content.length) {
							content = content + ', ';
						}

						content = content
							+ _(param['id_device_command_type_param$description'])
							+ ': ' + param.value;
					});

					return content;
				}
			}
		]
	}
});
