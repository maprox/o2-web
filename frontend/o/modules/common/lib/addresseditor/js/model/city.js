C.define('O.model.address.City', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
			{name: 'id', type: 'int'},
			{name: 'name', type: 'string'},
			{name: 'id_country', type: 'int'}
		]
	}
});

C.define('O.store.address.City', {
	extend: 'Ext.data.Store',
	model: 'O.model.address.City',

	autoSync: false,
	autoLoad: false,
	sortOnLoad: true,
	remoteSort: false,
	proxy: O.proxy.Ajax.get('a_city'),

	storeId: 'addressCityStore',
	sorters: [{
		property: 'name',
		direction: 'ASC'
	}]
});
