/**
 * @fileOverview Роутер расписаний
 */

/**
 * Роутер расписаний
 *
 * @class O.proxy.Schedule
 * @extends O.proxy.Custom
 */
C.define('O.proxy.Schedule', {
	extend: 'O.proxy.Custom',

/**
	* Идентификатор прокси-объекта
	* @type String
	*/
	id: 'schedules',

/**
	* Текст предзагрузки
	* @type String
	*/
	preloadText: 'Schedules',

/**
	* Тип объектов в хранилище роутера
	* @type Object
	*/
	type: O.model.Schedule,
	needPreload: false
});

// Регистрируем роутер в менеджере модели
O.manager.Model.register(new O.proxy.Schedule());