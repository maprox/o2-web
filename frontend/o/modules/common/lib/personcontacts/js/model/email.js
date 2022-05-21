Ext.define('O.lib.personcontacts.model.Email', {
	extend: 'Ext.data.Model',
	fields: [
		{name: 'note',  type: 'string'},
		{name: 'address',  type: 'string'},
		{name: 'isprimary',  type: 'int'}
	]
});
