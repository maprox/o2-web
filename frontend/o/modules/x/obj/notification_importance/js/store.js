/**
 *
 */

/**
 * Global store of x_notification_importance model data
 * @class C.data.X.notification.importance.Store
 * @extend Ext.data.Store
 */
C.define('C.data.X.notification.importance.Store', {
	extend: 'Ext.data.Store',
	storeId: 'store-x_notification_importance',
	model: 'X.NotificationImportance',
	proxy: {type: 'memory'},
	data: []
}, function() { new this });

/**
 * Executes after loading of all script pieces,
 * including language files.
 */
C.onload(function() {
	// let's add some data to a store
	var store = Ext.getStore('store-x_notification_importance');
	if (store) {
		store.loadData([
			{id: 1, name: _('Information')},
			{id: 2, name: _('Medium')},
			{id: 3, name: _('High')},
			{id: 4, name: _('Critical')}
		]);
	}
});