/**
 * @fileOverview Описание интерфейса свойств пакетов
 */

/**
 * Определение класса свойств пакетов
 * @class O.model.Prop
 * @extends O.model.Object
 */
C.define('O.model.Prop', {
	extend: 'O.model.Object'
});

C.define('Props', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
			{name: 'id', type: 'int'},
			{name: 'name', type: 'string'},
			{name: 'field', type: 'string'},
			{name: 'type_id', type: 'int'}
		]
	}
});
