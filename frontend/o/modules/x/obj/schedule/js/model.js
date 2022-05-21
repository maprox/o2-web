/**
 * @fileOverview Описание интерфейса расписания
 */

/**
 * Определение класса для расписаний
 * @class O.model.Schedule
 * @extends O.model.Object
 */
C.define('O.model.Schedule', {
	extend: 'O.model.Object'
});

C.define('Schedules', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
			{name: 'id', type: 'int'},
			{name: 'from', type: 'string'},
			{name: 'to', type: 'string'},
			{name: 'mon', type: 'int'},
			{name: 'tue', type: 'int'},
			{name: 'wed', type: 'int'},
			{name: 'thu', type: 'int'},
			{name: 'fri', type: 'int'},
			{name: 'sat', type: 'int'},
			{name: 'sun', type: 'int'}
		]
	}
});
