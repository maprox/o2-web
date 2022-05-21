/**
 * Virtual "x_provider" model.
 * It does not exist at backend yet
 * @class C.data.X.Provider
 * @extend Ext.data.Model
 */
C.define('C.data.X.Provider', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
			{name: 'id', type: 'int'},
			{name: 'name', type: 'string'},
			{name: 'apn', type: 'string'},
			{name: 'login', type: 'string'},
			{name: 'password', type: 'string'}
		]
	}
});

/**
 * Global store of x_provider model data
 * @class C.data.X.provider.Store
 * @extend Ext.data.Store
 */
C.define('C.data.X.provider.Store', {
	extend: 'Ext.data.Store',
	storeId: 'store-x_provider',
	model: 'C.data.X.Provider',
	proxy: {type: 'memory'}
}, function() { new this });

/**
 * Executes after loading of all script pieces,
 * including language files.
 */
C.onload(function() {
	// let's add some data to a store of gsm providers
	var store = Ext.getStore('store-x_provider');
	if (store) {
		store.loadData([{
			id: 0,
			name: _('Other'),
			apn: '',
			login: '',
			password: ''
		}, {
			id: 4,
			name: _('Megafon (Maprox)'),
			apn: 'tele237.msk',
			login: '',
			password: ''
		}, {
			id: 1,
			name: _('Megafon'),
			apn: 'internet',
			login: '',
			password: ''
		}, {
			id: 2,
			name: _('MTS'),
			apn: 'internet.mts.ru',
			login: '',
			password: ''
		}, {
			id: 3,
			name: _('Beeline'),
			apn: 'internet.beeline.ru',
			login: 'beeline',
			password: 'beeline'
		}]);
	}
});
