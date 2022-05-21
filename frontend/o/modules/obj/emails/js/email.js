/**
 * @fileOverview Описание интерфейса почтового адреса
 */

/**
 * Определение класса для почтовых адресов
 * @class O.model.Email
 * @extends O.model.Object
 */
C.define('O.model.Email', {
	extend: 'O.model.Object'
});

C.define('Email', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
			{name: 'id', type: 'int'},
			{name: 'name', type: 'string'}
		]
	}
});
