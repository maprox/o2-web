/**
 * @fileOverview Роутер списка пользователей
 */

/**
 * Роутер списка датчиков
 *
 * @class O.proxy.Sensor
 * @extends O.proxy.Custom
 */
C.define('O.proxy.Sensor', {
	extend: 'O.proxy.Custom',

/**
	* Идентификатор прокси-объекта
	* @type String
	*/
	id: 'sensors',

/**
	* Текст предзагрузки
	* @type String
	*/
	preloadText: 'Sensors',

/**
	* Тип объектов в хранилище роутера
	* @type Object
	*/
	type: O.model.Sensor,
	needPreload: false
});

// Регистрируем роутер в менеджере модели
O.manager.Model.register(new O.proxy.Sensor());