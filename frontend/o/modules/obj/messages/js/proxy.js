/**
 * @fileOverview Роутер списка точек
 */

/**
 * Роутер списка сообщений
 *
 * @class O.proxy.Point
 * @extends O.proxy.Custom
 */
C.define('O.proxy.Message', {
	extend: 'O.proxy.Custom',

/**
	* Идентификатор прокси-объекта
	* @type String
	*/
	id: 'points',

/**
	* Текст предзагрузки
	* @type String
	*/
	preloadText: 'Messages',

/**
	* Тип объектов в хранилище роутера
	* @type Object
	*/
	type: O.model.Message,
	needPreload: false
});

// Регистрируем роутер в менеджере модели
O.manager.Model.register(new O.proxy.Message());