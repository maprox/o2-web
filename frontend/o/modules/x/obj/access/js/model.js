/**
 * @class O.x.model.Access
 * @extends O.model.Object
 */
C.define('O.x.model.Access', {
	extend: 'O.model.Object',
	model: 'X.Access'
});

C.define('X.Access', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
			{name: 'id', type: 'int'},
			{name: 'id_user', type: 'int'},
			{name: 'id_object', type: 'int'},
			{name: 'right', type: 'string'},
			{name: 'writeable', type: 'int'},
			{name: 'shared', type: 'int'},
			{name: 'id_firm', type: 'int'},
			{name: 'firm_name', type: 'string', persist: false},
			{name: 'sdt', type: 'date', dateFormat: 'c'},
			{name: 'edt', type: 'date', dateFormat: 'c'},
			{name: 'status', type: 'int'}
		]
	}
});
