/**
 *
 * RU
 *
 */
/*
C.utils.inherit('O.proxy.Device', {
	preloadText: 'Устройства'
});
*/
var devicePropsStore = Ext.getStore('devicePropsStore');
if (devicePropsStore)
{
	devicePropsStore.loadData([
		{id: 88, name: 'Телефон', field: 'phone'},
		{id: 65, name: 'Примечание', field: 'note'},
		{id: 1, name: 'Идентификатор', field: 'identifier'},
		{id: 0, name: 'Название', field: 'name'}
	]);
}