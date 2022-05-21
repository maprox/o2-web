new Ext.data.Store({
	storeId: 'productRemote',
	model: 'Product',
	autoLoad: true,
	autoSync: true,
	remoteFilter: true,
	proxy: O.proxy.Ajax.get('dn_product')
});

new Ext.data.Store({
	storeId: 'productInline',
	model: 'Product',
	pageSize: 50,
	autoLoad: true,
	remoteSort: true,
	remoteFilter: true,
	proxy: new O.proxy.Store({
		storeId: 'productRemote'
	}),
	sorters: [{
		property: 'name',
		direction: 'ASC'
	}]
});
