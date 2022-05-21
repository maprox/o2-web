/**
 * @fileOverview Описание интерфейса сообщений
 *
 * Определение класса для сообщений
 * @class O.model.Message
 * @extends O.model.Object
 */
C.define('O.model.Message', {
	extend: 'O.model.Object'
});

C.define('Messages', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
			{name: 'id', type: 'int'},
			{name: 'date', type: 'string'},
			{name: 'msg', type: 'string'},
			{name: 'actions', type: 'string'},
			{name: 'success', type: 'bool'}
		]
	}
});
