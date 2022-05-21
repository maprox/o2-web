/**
 * @fileOverview Описание интерфейса почтового адреса
 */

/**
 * Определение класса для телефонных номеров
 * @class O.model.Phone
 * @extends O.model.Object
 */
C.define('O.model.Phone', {
	extend: 'O.model.Object'
});

C.define('Phone', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
			{name: 'id', type: 'int'},
			{name: 'name', type: 'string'}
		]
	}
});
