/**
 * @fileOverview Обработчик ошибок.
 * Сопоставляет код ошибки с сообщением об ошибке.<br/>
 * <p>Для получения текста сообщения об ошибки
 */
EL = new Ext.util.MixedCollection();
EL.fmt = "<div class='error_text'>{0}</div>";
EL.addAll([
	{id:    0, fmt: 'Unknown error: <br/><b>{0}</b>'},
	{id:    1, fmt: 'Incorrect error object returned.<br/><b>{0}</b>'},
	{id:    2, fmt: 'Database interaction error:<br/><b>{0}</b>'},
	{id:    3, fmt: 'Database request error:<br/><b>{0}</b>'},
	{id:    4, fmt: 'Error reading of JSON-reply from server:<br/>' +
		'URL: <b>{0}</b><br/>' +
		'Params: <b>{1}</b><br/>' +
		'Contents:<br/><b>{2}</b>'},
	{id:   10, fmt: 'Database connection error:<br/><b>{0}</b>'},
	{id:   20, fmt: 'Error while loading model:<br/><b>{0}</b>.'},
	{id:   30, fmt: 'Error while saving model:<br/><b>{0}</b>.'},
	{id:   40, fmt: 'Not implemented:<br/><b>{0}</b>.'},
	{id:   50, fmt: 'Not found:<br/><b>{0}</b>.'},
	{id:   60, fmt: '<b>{0}</b> already exists.'},
	{id:  100, fmt: 'Report creating error:<br/><b>{0}</b>'},
	{id:  403, fmt: 'Access to object [{0}] is forbidden.'},
	{id:  404, fmt: 'Object [{0}] wasn\'t found in database.'},
	{id:  415, fmt: 'User disabled.'},
	{id:  416, fmt: 'Time does not match the schedule.'},
	{id:  500, fmt: '500. Internal Server Error'},
	{id:  501, fmt: 'Front-end error:<br/><b>{0}</b>'},
	{id:  700, fmt: 'Error occured while working with DB'},
	{id:  901, fmt: 'Device <b>{0}</b> is not active.'},
	{id: 4040, fmt: 'Login or password doesn\'t match.'},
	{id: 4041, fmt: 'Both fields are required.'},
	{id: 4042, fmt: 'Incorrect input data.'},
	{id: 4043, fmt: 'All fields are required'},
	{id: 4044, fmt: 'Password confirmation do not match'},
	{id: 4045, fmt: 'Incorrect current password'},
	{id: 4046, fmt: 'The E-mail for this login is empty,' +
		'contact administrator.'},
	{id: 4047, fmt: 'There is no users with this login.'},
	{id: 4048, fmt: 'Error quering geocoding service.'},
	{id: 4049, fmt: 'Unknown geocoder parameters.'},
	{id: 4050, fmt: 'Tariff using.'},
	{id: 4051, fmt: 'Firm is disabled'},
	{id: 4052, fmt: 'Firm billing is unpaid'},
	{id: 4053, fmt: 'Can\'t connect to tracker server'},
	{id: 4054, fmt: 'Account is not activated yet'},
	{id: 4055, fmt: 'You need to provide a new password and confirmation'},
	{id: 4056, fmt: 'Password is too short, it must have at least 6 characters'},
	{id: 4057, fmt: 'New password mathes old password'},
	{id: 4058, fmt: 'Error while saving settings'},
	{id: 4110, fmt: 'This vehicle already has active waylist {0}'},
	{id: 4111, fmt: 'This waylist cannot overlap with waylist {0}'},
	{id: 4112, fmt: 'Waylist {0} have unspecified date ' +
		'and potentially overlaps with this one'},
	{id: 4113, fmt: 'This waylist have unspecified date ' +
		'and potentially overlaps with waylist {0}'},
	{id: 4200, fmt: 'Articul {0} already exists'}
]);
