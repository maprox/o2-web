/**
 * @class O.mon.model.device.command.Template
 * @extends O.model.Object
 */
C.define('O.mon.model.device.command.Template', {
	extend: 'O.model.Object',
	model: 'Mon.Device.Command.Template'
});

C.define('Mon.Device.Command.Template', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
			{name: 'id', type: 'int'},
			{name: 'id_device', type: 'int'},
			{name: 'id_command_type', type: 'int'},
			{name: 'transport', type: 'string'},
			{name: 'name', type: 'string'},
			//{name: 'params', type: 'object'} // deprecated
			{name: 'params', type: 'string'},
			{name: 'state', type: 'int', useNull: true},
			{name: 'last_command', type: 'object'},

			// Joined field
			{name: 'id_command_type$name', type: 'string'},

			// Convert fields
			{name: 'status', type: 'string',
				convert: function(value, record) {

					var lastCommand = record.get('last_command');

					if (!lastCommand) {
						return '';
					}

					// Convert date
					var dt = lastCommand.dt;
					if (lastCommand.edt) {
						dt = lastCommand.edt;
					}

					var dateString = Ext.Date.format(new Date().pg_fmt(dt)
						.pg_utc(C.getSetting('p.utc_value')),
						O.format.Date + ' ' + O.format.TimeShort
					);

					var statusCode = lastCommand.status;
					var statusText = '';
					if (statusCode === C.cfg.STATUS_SENT) {
						statusText = _('Sent');
					}

					if (statusCode === C.cfg.STATUS_DELIVERED) {
						statusText = _('Delivered');
					}

					if (statusCode === C.cfg.STATUS_ERROR) {
						statusText = _('Error');
					}

					return dateString + ' &mdash; ' + statusText;
				}
			},

			// Fields used in mobile version
			{name: 'button_text', type: 'string',
				convert: function(value, record) {
					var statusText = _('Send');
					var lastCommand = record.get('last_command');

					if (!lastCommand) {
						return statusText;
					}

					var statusCode = lastCommand.status;


					if (statusCode === C.cfg.STATUS_SENT) {
						statusText = _('Sent');
					}

					return statusText;
				}
			},

			{name: 'button_disabled', type: 'bool',
				convert: function(value, record) {
					var lastCommand = record.get('last_command');

					if (!lastCommand) {
						return false;
					}

					var statusCode = lastCommand.status;

					if (statusCode === C.cfg.STATUS_SENT) {
						return true;
					}

					return false;
				}
			}
		]
	}
});
