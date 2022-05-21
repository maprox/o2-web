/**
 * @fileOverview Класс события системы
 */

Ext.ns('O.model');

/**
 * Event type
 * @enum
 */
O.model.eventtype = {
	/** Смена состояния */
	STATECHANGE: 7
};


/**
 * Класс события системы.
 * События будут загружаться менеджером событий O.model.EventManager
 * методом get(sdt, edt, function, scope)
 * @class O.model.Event
 * @extends Ext.util.Observable
 */
C.define('O.model.Event', {
	extend: 'Ext.util.Observable',

/**
	* Идентификатор триггера-инициатора события
	* @type Number
	*/
	ownerid: 0,

/**
	* Тип события
	* @type O.model.eventtype
	*/
	eventid: 0,

/**
	* Дата возникновения события
	* @type Date
	*/
	dt: null,

/**
	* Значение события
	*/
	eventval: null,

/**
	* @constructs
	* @param {Object} config Объект конфигурации
	*/
	constructor: function(config) {
		this.params = []; // создаем массив параметров
		this.callParent(arguments);
		this.ownerid = Number(this.ownerid); // преобразуем в целое число
		this.type = Number(this.type); // преобразуем в целое число
	},

/**
	* Функция проверки идентичности данного события событию event
	* @param {O.model.Event} event Событие, с которым мы сравниваем "себя"
	* @returns Boolean
	*/
	isEqualTo: function(event) {
		return (
			(event.dt.equal(this.dt)) &&
			(event.eventid === this.eventid) &&
			(event.ownerid === this.ownerid)
		);
	}
});

/**
 * Event object
 */
C.define('Event', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
			{name: 'dt', type: 'datetime'},
			{name: 'ownerid', type: 'int'},
			{name: 'eventid', type: 'int'},
			{name: 'eventval', type: 'string'},
			{name: 'eventtext', type: 'string'}
		]
	}
});
