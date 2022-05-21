C.define('O.model.address.Street', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
			{name: 'id', type: 'int'},
			{name: 'name', type: 'string'},
			{name: 'id_city', type: 'int'}
		]
	}
});

C.define('O.store.address.Street', {
	extend: 'Ext.data.Store',
	model: 'O.model.address.Street',

	autoSync: false,
	autoLoad: false,
	sortOnLoad: true,
	remoteSort: false,
	proxy: O.proxy.Ajax.get('a_street'),

	storeId: 'addressCityStreet',
	sorters: [{
		property: 'name',
		direction: 'ASC'
	}]
});
