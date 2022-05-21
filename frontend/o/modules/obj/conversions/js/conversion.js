/**
 * @fileOverview Описание интерфейса преобразований
 */

/**
 * Определение класса для преобразований
 * @class O.model.Conversion
 * @extends O.model.Object
 */
C.define('O.model.Conversion', {
	extend: 'O.model.Object'
});

C.define('Conversions', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
			{name: 'id', type: 'int'},
			{name: 'smoothing', type: 'bool'}
		]
	}
});
