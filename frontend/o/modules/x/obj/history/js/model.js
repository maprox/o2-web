/**
 * @class O.x.model.History
 * @extends O.model.Object
 */
C.define('O.x.model.History', {
	extend: 'O.model.Object',
	model: 'X.History'
});

C.define('X.History', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
			{name: 'id', type: 'int'},
			{name: 'dt', type: 'date', dateFormat: 'c'},
			{name: 'entity_table', type: 'string'},
			{name: 'id_entity', type: 'int'},
			{name: 'id_operation', type: 'int'},
			{name: 'id_user', type: 'int'},
			{name: 'firstname', type: 'string', persist: false},
			{name: 'lastname', type: 'string', persist: false},
			{name: 'firm_name', type: 'string', persist: false},
			{name: 'data', type: 'object', persist: false},
			{name: 'diff', type: 'object', persist: false},
			{name: 'type', type: 'string', persist: false},
			{name: 'username', type: 'string',
				convert: function(value, record) {
					var name = record.get('firstname');

					if (record.get('lastname')) {
						name = name + ' ' + record.get('lastname');
					}

					return name;
				}
			}
		]
	}
});
