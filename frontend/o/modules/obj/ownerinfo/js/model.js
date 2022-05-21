/**
 * @class O.x.model.History
 * @extends O.model.Object
 */
C.define('O.model.Ownerinfo', {
	extend: 'O.model.Object',
	model: 'Ownerinfo'
});

C.define('Ownerinfo', {
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
			{name: 'sdt', type: 'date', dateFormat: 'c'},
			{name: 'edt', type: 'date', dateFormat: 'c'},
			{name: 'granted_by', type: 'string',
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
