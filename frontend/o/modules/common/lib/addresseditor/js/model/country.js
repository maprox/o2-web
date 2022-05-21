C.define('O.model.address.Country', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
			{name: 'id', type: 'int'},
			{name: 'name', type: 'string'},
			{name: 'code', type: 'int'}
		]
	}
});

C.define('O.store.address.Country', {
	extend: 'Ext.data.Store',
	model: 'O.model.address.Country',

	autoSync: false,
	autoLoad: true,
	sortOnLoad: true,
	remoteSort: false,
	proxy: O.proxy.Ajax.get('a_country'),

	storeId: 'addressCityCountry',
	sorters: [{
		property: 'name',
		direction: 'ASC'
	}]
});
