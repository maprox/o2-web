Ext.define('O.lib.personcontacts.model.Phone', {
	extend: 'Ext.data.Model',
	fields: [
		{name: 'note',  type: 'string'},
		{name: 'number',  type: 'string'},
		{name: 'isprimary',  type: 'int'}
	]
});
