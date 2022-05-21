/**
 * @class O.mon.model.WaylistRouteUpdate
 * @extends O.model.Object
 */
C.define('O.mon.model.WaylistRouteUpdate', {
	extend: 'O.model.Object',
	model: 'Mon.WaylistRouteUpdate'
});
/**
 * Фиктивный объект, нужен только для подписи на обновления
 */
C.define('Mon.WaylistRouteUpdate', {
	extend: 'Ext.data.Model',

	config: {
		fields: [
			{name: 'id', type: 'int'}
		]
	}
});
