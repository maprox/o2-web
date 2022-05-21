/**
 *
 * Store for grid of supplier accounts
 */

new Ext.data.Store({
	storeId: 'storeSupplierAccount',
	model: 'modelSupplierAccount',
	autoLoad: false,
	autoSync: true,
	sortOnLoad: true,
	sorters: [{
		property: 'id_firm',
		direction: 'DESC'
	}]
});