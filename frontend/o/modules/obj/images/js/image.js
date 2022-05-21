/**
 * @fileOverview Описание интерфейса изображений
 */

/**
 * Определение класса изображений
 * @class O.model.Image
 * @extends O.model.Object
 */
C.define('O.model.Image', {
	extend: 'O.model.Object'
});

C.define('Images', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
			{name: 'id', type: 'int'},
			{name: 'alias', type: 'string'},
			{name: 'src', type: 'string'}
		]
	}
});
