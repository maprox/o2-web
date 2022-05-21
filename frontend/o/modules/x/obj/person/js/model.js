/**
 * @class O.x.model.Person
 * @extends O.model.Object
 */
C.define('O.x.model.Person', {
	extend: 'O.model.Object',
	model: 'X.Person'
});

C.define('X.Person', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
			{name: 'id', type: 'int'},
			{name: 'firstname', type: 'string'},
			{name: 'lastname', type: 'string'},
			{name: 'secondname', type: 'string'},
			{name: 'birth_place', type: 'string'},
			{name: 'birth_dt', type: 'date', dateFormat: 'c'},
			{name: 'residential_address', type: 'string'},
			{name: 'note', type: 'string'},
			{name: 'gender', type: 'int'},
			{name: 'email', type: 'auto'},
			{name: 'phone', type: 'auto'},
			{name: 'driver_license', type: 'object'},
			{name: 'passport', type: 'object'},
			{name: 'state', type: 'int'},
			{name: 'fullname', persist: false,
				convert: function(v, rec) {
					return rec.get('lastname') + ' ' +
						   rec.get('firstname') + ' ' +
						   rec.get('secondname');
				}},
			{name: 'shortname', persist: false,
				convert: function(v, rec) {
					return rec.get('lastname') + (
						rec.get('firstname') ? ' ' +
						rec.get('firstname').substr(0, 1) + '.' + (
						rec.get('secondname') ?
						rec.get('secondname').substr(0, 1) + '.' : ''
					): '');
			}},
			{name: 'attachments', type: 'object'}
		]
	}
});
