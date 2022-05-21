/**
 * @fileOverview Описание интерфейса пользователя системы
 */

/**
 * Определение класса для датчиков
 * @class O.model.Sensor
 * @extends O.model.Object
 */
C.define('O.model.Sensor', {
	extend: 'O.model.Object'
});

C.define('Sensors', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
			{name: 'id', type: 'int'},
			{name: 'name', type: 'string'},
			{name: 'param', type: 'string'},
			{name: 'id_prop', type: 'int'},
			{name: 'propertyname', type: 'string'},
			//{name: 'sensortype', type: 'int', defaultValue: 0},
			{name: 'id_conversion', type: 'int'},
			{name: 'convert', type: 'bool'},
			{name: 'manual', type: 'bool'},
			{name: 'val', type: 'string'}
		]
	}
});
