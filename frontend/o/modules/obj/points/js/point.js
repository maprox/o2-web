/**
 * @fileOverview Описание интерфейса точек
 */

/**
 * Определение класса для точек
 * @class O.model.Point
 * @extends O.model.Object
 */
C.define('O.model.Point', {
	extend: 'O.model.Object'
});

C.define('Points', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
			{name: 'id', type: 'int'},
			{name: 'x', type: 'float'},
			{name: 'y', type: 'float'}
		]
	}
});
